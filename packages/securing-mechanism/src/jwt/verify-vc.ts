import { OpVc, Jwk } from "@originator-profile/model";
import { jwtVerify, exportJWK } from "jose";
import { JOSEError } from "jose/errors";
import { Keys } from "@originator-profile/cryptography";
import {
  VerifiedJwtVc,
  JwtVcVerificationResult,
  JwtVcVerificationFailure,
} from "./types";
import { VcVerifyFailed, VcValidateFailed } from "../errors";
import { toVerifiedJwtVc } from "./map-vc";
import { VcValidator } from "../validate-vc";

/**
 * JWT VC の検証者の作成
 * @param keys 公開鍵
 * @param issuer 公開鍵の有効な発行者
 * @param validator バリデーター
 * @return 検証者
 */
export function JwtVcVerifier<T extends OpVc>(
  keys: Keys,
  issuer: string,
  validator?: VcValidator<VerifiedJwtVc<T>>,
) {
  /**
   * JWT VC の検証
   * @param jwt JWT
   * @return 検証結果
   */
  async function verify(jwt: string): Promise<JwtVcVerificationResult<T>> {
    const verified = await jwtVerify<T>(jwt, keys, { issuer }).catch(
      (e: JOSEError) => e,
    );
    if (verified instanceof JOSEError) {
      return new VcVerifyFailed<JwtVcVerificationFailure>(
        "JWT VC Verification Failure",
        {
          source: jwt,
          error: verified,
        },
      );
    }
    const { payload, protectedHeader, key } = verified;
    const jwk = (await exportJWK(key)) as Jwk;
    const vc = toVerifiedJwtVc<T>(payload, protectedHeader, jwt, jwk);
    if (!validator) return vc;
    const validated = validator(vc);
    if (validated instanceof VcValidateFailed) return validated;
    validated.validated = true;
    return validated;
  }

  return verify;
}

export type JwtVcVerifier<T extends OpVc> = ReturnType<typeof JwtVcVerifier<T>>;
