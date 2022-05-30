import { jwtVerify } from "jose";
import { JOSEError } from "jose/dist/types/util/errors";
import { isJwtOpPayload, isJwtDpPayload, toOp, toDp } from "./claims";
import { TokenDecoder } from "./decode";
import { ProfileTokenVerifyFailed } from "./errors";
import { Keys } from "./keys";
import { VerifyTokenResult } from "./types";

/**
 * Profile の Token の検証者の生成
 * @param keys 公開鍵
 * @param issuer 公開鍵の有効な発行者
 * @param decoder 復号器
 * @return 検証者
 */
export function TokenVerifier(
  keys: Keys,
  issuer: string,
  decoder: TokenDecoder
): (jwt: string) => Promise<VerifyTokenResult> {
  /**
   * Profile の Token の検証
   * @param jwt JWT
   * @return 検証結果
   */
  async function verifyToken(jwt: string): Promise<VerifyTokenResult> {
    const decoded = decoder(jwt);
    if (decoded instanceof Error) return decoded;
    const verifyOptions = isJwtOpPayload(decoded) ? { issuer } : {};
    const verified = await jwtVerify(jwt, keys, verifyOptions).catch(
      (e: JOSEError) => e
    );
    if (verified instanceof Error) {
      return new ProfileTokenVerifyFailed(verified.message, {
        ...decoded,
        error: verified,
      });
    }
    if (isJwtOpPayload(verified.payload)) {
      return { ...verified, op: toOp(verified.payload) };
    }
    if (isJwtDpPayload(verified.payload)) {
      return { ...verified, dp: toDp(verified.payload) };
    }
    return new ProfileTokenVerifyFailed(
      "Profile Token Verification Failed",
      decoded
    );
  }

  return verifyToken;
}

export type TokenVerifier = ReturnType<typeof TokenVerifier>;
