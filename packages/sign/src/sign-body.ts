import { CompactSign, importJWK } from "jose";
import { createThumbprint } from "./thumbprint";
import { Jwk } from "@originator-profile/model";

/**
 * 対象のテキストへの署名
 * @param body 対象のテキスト
 * @param privateKey プライベート鍵
 * @param alg Algorithm identifier
 * @return Detached Compact JWS
 */
export async function signBody(
  body: string,
  privateKey: Jwk,
  alg = "ES256",
): Promise<string> {
  const header = {
    alg,
    kid: await createThumbprint(privateKey, alg),
    b64: false,
    crit: ["b64"],
  };
  const payload = new TextEncoder().encode(body);
  const privateKeyImported = await importJWK(privateKey, alg);
  const jws = await new CompactSign(payload)
    .setProtectedHeader(header)
    .sign(privateKeyImported);
  return jws;
}
