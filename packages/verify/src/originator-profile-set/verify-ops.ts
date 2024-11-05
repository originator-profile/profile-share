import {
  CoreProfile,
  WebMediaProfile,
  OriginatorProfileSet,
  OpVc,
} from "@originator-profile/model";
import {
  JwtVcDecoder,
  JwtVcDecodingResultPayload,
  JwtVcVerifier,
  JwtVcVerificationResult,
} from "@originator-profile/jwt-securing-mechanism";
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

const isVerifiedOps = (ops: OpVerificationResult[]): ops is VerifiedOps =>
  ops.every((op) => !(op instanceof OpVerifyFailed));

/**
 * Originator Profile Set の検証者の作成
 * @param ops Originator Profile Set
 * @param keys Core Profile の発行者の検証鍵
 * @param issuer Core Profile の発行者
 * @returns 検証者
 */
export function OpsVerifier(
  ops: OriginatorProfileSet,
  keys: Keys,
  issuer: string,
) {
  const decoded = decodeOps(ops);
  const verifyCp = JwtVcVerifier<CoreProfile>(
    keys,
    issuer,
    JwtVcDecoder<CoreProfile>(),
  );

  /**
   * Originator Profile Set の検証
   * @returns 検証結果
   */
  async function verify(): Promise<OpsVerificationResult> {
    if (decoded instanceof OpsInvalid) {
      return decoded;
    }
    const cps = new Map<
      CoreProfile["credentialSubject"]["id"],
      JwtVcVerificationResult<CoreProfile>
    >(
      await Promise.all(
        decoded.map(({ core }) =>
          verifyCp(core.jwt).then(
            (result) => [core.payload.credentialSubject.id, result] as const,
          ),
        ),
      ),
    );
    const opVerifier = <T extends OpVc>(vc: JwtVcDecodingResultPayload<T>) => {
      const cpHolder = vc.payload.issuer;
      const cp = cps.get(cpHolder);
      if (!cp) {
        return async () =>
          new CoreProfileNotFound(`Missing Core Profile (${cpHolder})`, vc);
      }
      if (cp instanceof Error) {
        return async () =>
          new CoreProfileNotFound(`Invalid Core Profile (${cpHolder})`, vc);
      }
      const cpKeys = LocalKeys(cp.payload.credentialSubject.jwks);
      return JwtVcVerifier<T>(cpKeys, cpHolder, JwtVcDecoder<T>());
    };
    const resultOps = await Promise.all(
      decoded.map(async (op): Promise<OpVerificationResult> => {
        const core =
          cps.get(op.core.payload.credentialSubject.id) ??
          new CoreProfileNotFound(
            `Missing Core Profile (${op.core.payload.credentialSubject.id})`,
            op.core,
          );
        const annotations =
          op.annotations &&
          (await Promise.all(
            op.annotations.map((annotation) =>
              opVerifier<Certificate>(annotation)(annotation.jwt),
            ),
          ));
        const media =
          op.media &&
          (await opVerifier<WebMediaProfile>(op.media)(op.media.jwt));
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
