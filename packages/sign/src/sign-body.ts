import { importPKCS8, CompactSign } from "jose";

/**
 * 対象のテキストへの署名
 * @param body 対象のテキスト
 * @param pkcs8 PEM base64 でエンコードされた PKCS #8 秘密鍵
 * @param alg Algorithm identifier
 * @return Detached Compact JWS
 */
export async function signBody(
  body: string,
  pkcs8: string,
  alg = "ES256"
): Promise<string> {
  const header = {
    alg,
    b64: false,
    crit: ["b64"],
  };
  const payload = new TextEncoder().encode(body);
  const privateKey = await importPKCS8(pkcs8, alg);
  const jws = await new CompactSign(payload)
    .setProtectedHeader(header)
    .sign(privateKey);
  return jws;
}
