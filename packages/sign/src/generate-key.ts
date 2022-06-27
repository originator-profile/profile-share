import { Jwk } from "@webdino/profile-model";
import { generateKeyPair, exportJWK, exportPKCS8 } from "jose";

/**
 * 鍵の生成
 * JWK 形式の公開鍵と PEM base64 でエンコードされた PKCS #8 秘密鍵を生成する
 * @param alg Algorithm identifier
 */
export async function generateKey(
  alg = "ES256"
): Promise<{ jwk: Jwk; pkcs8: string }> {
  const { publicKey, privateKey } = await generateKeyPair(alg);
  const [{ kty, ...jwk }, pkcs8] = await Promise.all([
    exportJWK(publicKey),
    exportPKCS8(privateKey),
  ]);
  if (typeof kty !== "string") throw new Error("kty is not defined");
  return { jwk: { kty, ...jwk }, pkcs8 };
}
