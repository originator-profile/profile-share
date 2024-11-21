import {
  CoreProfile,
  WebMediaProfile,
  Certificate as CertificateSchema,
  JapaneseExistenceCertificate,
  OriginatorProfileSet,
  OpVc,
} from "@originator-profile/model";
import {
  UnverifiedJwtVc,
  VerifiedJwtVc,
  JwtVcVerifier,
  JwtVcVerificationResult,
  VcValidator,
} from "@originator-profile/securing-mechanism";
import {
  Certificate,
  VerifiedOps,
  OpsVerificationResult,
  VerifiedOp,
  OpVerificationResult,
} from "./types";
import { Keys, LocalKeys } from "@originator-profile/cryptography";
import { decodeOps } from "./decode-ops";
import {
  CoreProfileNotFound,
  OpsInvalid,
  OpsVerifyFailed,
  OpVerifyFailed,
} from "./errors";

/** CP の署名検証結果 */
type CoreProfileMap = Map<
  CoreProfile["credentialSubject"]["id"],
  JwtVcVerificationResult<CoreProfile>
>;

/** OP (CP を除く) 署名検証者 */
function OpVerifier<T extends OpVc>(
  cps: CoreProfileMap,
  vc: UnverifiedJwtVc<T>,
  validator?: VcValidator<VerifiedJwtVc<T>>,
): JwtVcVerifier<T> | (() => Promise<CoreProfileNotFound<T>>) {
  const cpHolder = vc.doc.issuer;
  const cp = cps.get(cpHolder);
  if (!cp) {
    return async () =>
      new CoreProfileNotFound(`Missing Core Profile (${cpHolder})`, vc);
  }
  if (cp instanceof Error) {
    return async () =>
      new CoreProfileNotFound(`Invalid Core Profile (${cpHolder})`, vc);
  }
  const cpKeys = LocalKeys(cp.doc.credentialSubject.jwks);
  return JwtVcVerifier<T>(cpKeys, cpHolder, validator);
}

/** annotations プロパティの署名検証 */
async function verifyAnnotations(
  cps: CoreProfileMap,
  annotations?: UnverifiedJwtVc<Certificate>[],
  validator?: typeof VcValidator,
) {
  if (!annotations) return;
  return await Promise.all(
    annotations.map((annotation) => {
      const verify = OpVerifier<Certificate>(
        cps,
        annotation,
        validator?.({
          oneOf: [CertificateSchema, JapaneseExistenceCertificate],
        }),
      );
      return verify(annotation.source);
    }),
  );
}

/** media プロパティの署名検証 */
async function verifyMedia(
  cps: CoreProfileMap,
  media?: UnverifiedJwtVc<WebMediaProfile>,
  validator?: typeof VcValidator,
) {
  if (!media) return;
  const verify = OpVerifier<WebMediaProfile>(
    cps,
    media,
    validator?.(WebMediaProfile),
  );
  return await verify(media.source);
}

/** 検証済み OPS か否か */
const isVerifiedOps = (ops: OpVerificationResult[]): ops is VerifiedOps =>
  ops.every((op) => !(op instanceof OpVerifyFailed));

/**
 * Originator Profile Set の検証者の作成
 * @param ops Originator Profile Set
 * @param keys Core Profile の発行者の検証鍵
 * @param issuer Core Profile の発行者
 * @param validator バリデーター
 * @returns 検証者
 */
export function OpsVerifier(
  ops: OriginatorProfileSet,
  keys: Keys,
  issuer: string,
  validator?: typeof VcValidator,
) {
  const decoded = decodeOps(ops);
  const verifyCp = JwtVcVerifier<CoreProfile>(
    keys,
    issuer,
    validator?.(CoreProfile),
  );

  /**
   * Originator Profile Set の検証
   * @returns 検証結果
   */
  async function verify(): Promise<OpsVerificationResult> {
    if (decoded instanceof OpsInvalid) {
      return decoded;
    }
    const cps: CoreProfileMap = new Map(
      await Promise.all(
        decoded.map(({ core }) =>
          verifyCp(core.source).then(
            (result) => [core.doc.credentialSubject.id, result] as const,
          ),
        ),
      ),
    );
    const resultOps = await Promise.all(
      decoded.map(async (op): Promise<OpVerificationResult> => {
        const core =
          cps.get(op.core.doc.credentialSubject.id) ??
          new CoreProfileNotFound(
            `Missing Core Profile (${op.core.doc.credentialSubject.id})`,
            op.core,
          );
        const annotations = await verifyAnnotations(
          cps,
          op.annotations,
          validator,
        );
        const media = await verifyMedia(cps, op.media, validator);
        const resultOp = { core, annotations, media };

        if (core instanceof Error) {
          return new OpVerifyFailed("Core Profile verify failed", resultOp);
        }
        if (
          annotations &&
          annotations.some((annotation) => annotation instanceof Error)
        ) {
          return new OpVerifyFailed(
            "Profile Annotation verify failed",
            resultOp,
          );
        }
        if (media instanceof Error) {
          return new OpVerifyFailed(
            "Web Media Profile verify failed",
            resultOp,
          );
        }
        return resultOp as VerifiedOp;
      }),
    );
    if (!isVerifiedOps(resultOps)) {
      return new OpsVerifyFailed(
        "Originator Profile Set verify failed",
        resultOps,
      );
    }
    return resultOps;
  }
  return verify;
}
