import { jwtVerify } from "jose";
import { JOSEError } from "jose/errors";
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
): (sdJwt: string) => unknown {
  /**
   * Originator Profile の検証
   * @param sdJwt SD-JWT
   * @return 検証結果
   */
  async function verify(sdJwt: string): Promise<unknown> {
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
