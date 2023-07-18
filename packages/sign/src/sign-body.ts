import { CompactSign, importJWK } from "jose";
import { createThumbprint } from "./thumbprint";
import { Jwk } from "@originator-profile/model";

/**
 * 対象のテキストへの署名
 * @param body 対象のテキスト
 * @param privateKeyJwk PEM base64 でエンコードされた PKCS #8 プライベート鍵
 * @param alg Algorithm identifier
 * @return Detached Compact JWS
 */
export async function signBody(
  body: string,
  privateKeyJwk: Jwk,
  alg = "ES256",
): Promise<string> {
  const header = {
    alg,
    kid: await createThumbprint(privateKeyJwk, alg),
    b64: false,
    crit: ["b64"],
  };
  const payload = new TextEncoder().encode(body);
  const privateKey = await importJWK(privateKeyJwk, alg);
  const jws = await new CompactSign(payload)
    .setProtectedHeader(header)
    .sign(privateKey);
  return jws;
}
