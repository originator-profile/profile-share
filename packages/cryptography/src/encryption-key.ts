import { importJWK } from "jose";

/**
 * JOSE シークレットキーを暗号化鍵に変換
 * @param joseSecret シークレットキー (Base64 URL or Base64)
 * @return 暗号化鍵
 */
export async function importEncryptionKey(joseSecret: string) {
  return await importJWK({
    kty: "oct",
    k: joseSecret,
  });
}
