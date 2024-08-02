import { jwtVerify, JWTVerifyResult } from "jose";
import { JOSEError } from "jose/errors";
import { OriginatorProfile } from "@originator-profile/model";
import { Keys } from "./keys";
import { OriginatorProfileDecoder } from "./decode-originator-profile";

/**
 * Originator Profile の検証者の作成
 * @param keys 公開鍵
 * @param issuer 公開鍵の有効な発行者
 * @param decoder 復号器
 * @return 検証者
 */
export function OriginatorProfileVerifier(
  keys: Keys,
  issuer: string,
  decoder: OriginatorProfileDecoder,
): (
  sdJwt: string,
) => Promise<(JWTVerifyResult & { payload: OriginatorProfile }) | Error> {
  /**
   * Originator Profile の検証
   * @param sdJwt SD-JWT
   * @return 検証結果
   */
  async function verify(sdJwt: string) {
    const [issuerJwt] = sdJwt.split("~");
    const decoded = decoder(issuerJwt);
    if (decoded instanceof Error) return decoded;
    const verified = await jwtVerify(issuerJwt, keys, { issuer }).catch(
      (e: JOSEError) => e,
    );
    if (verified instanceof Error) {
      // TODO: 署名検証失敗時のエラーを定義して
      return verified;
    }
    return { ...verified, payload: decoded };
  }

  return verify;
}

export type OriginatorProfileVerifier = ReturnType<
  typeof OriginatorProfileVerifier
>;
