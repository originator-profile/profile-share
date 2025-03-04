import { Jwk } from "@originator-profile/model";
import { exportJWK, generateKeyPair } from "jose";
import { createThumbprint } from "./thumbprint";

/**
 * 鍵の生成（JWK形式）
 * 公開鍵とプライベート鍵を JWK 形式で生成する。
 * @param alg Algorithm identifier
 */
export async function generateKey(
  alg = "ES256",
): Promise<{ publicKey: Jwk; privateKey: Jwk }> {
  const { publicKey, privateKey } = await generateKeyPair(alg, {
    extractable: true,
  });
  const [publicJwk, privateJwk] = await Promise.all([
    exportJWK(publicKey),
    exportJWK(privateKey),
  ]);
  if (!publicJwk.kty || !privateJwk.kty) throw new Error("kty is not defined");

  const kid = await createThumbprint(publicJwk);

  return {
    publicKey: {
      kid,
      kty: publicJwk.kty,
      ...publicJwk,
    },
    privateKey: {
      kid,
      kty: privateJwk.kty,
      ...privateJwk,
    },
  };
}
