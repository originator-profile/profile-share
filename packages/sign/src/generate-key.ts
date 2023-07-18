import { Jwk } from "@originator-profile/model";
import { generateKeyPair, exportJWK, exportPKCS8 } from "jose";
import { createThumbprint } from "./thumbprint";

/**
 * 鍵の生成
 * JWK 形式の公開鍵と PEM base64 でエンコードされた PKCS #8 プライベート鍵を生成する
 * @param alg Algorithm identifier
 */
export async function generateKey(
  alg = "ES256",
): Promise<{ jwk: Jwk; pkcs8: string }> {
  const { publicKey, privateKey } = await generateKeyPair(alg);
  const [jwk, pkcs8] = await Promise.all([
    exportJWK(publicKey),
    exportPKCS8(privateKey),
  ]);
  if (typeof jwk.kty !== "string") throw new Error("kty is not defined");
  return {
    jwk: {
      kty: jwk.kty,
      kid: await createThumbprint(jwk),
      ...jwk,
    },
    pkcs8,
  };
}

/**
 * 鍵の生成（JWK形式）
 * 公開鍵とプライベート鍵を JWK 形式で生成する。
 * @param alg Algorithm identifier
 */
export async function generateKeyJwk(
  alg = "ES256",
): Promise<{ publicKey: Jwk; privateKey: Jwk }> {
  const { publicKey, privateKey } = await generateKeyPair(alg);
  const [publicKeyJwk, privateKeyJwk] = await Promise.all([
    exportJWK(publicKey),
    exportJWK(privateKey),
  ]);
  if (!publicKeyJwk.kty || !privateKeyJwk.kty)
    throw new Error("kty is not defined");

  const kid = await createThumbprint(publicKeyJwk);

  return {
    publicKey: {
      kty: publicKeyJwk.kty,
      kid,
      ...publicKeyJwk,
    },
    privateKey: {
      kty: privateKeyJwk.kty,
      kid,
      ...privateKeyJwk,
    },
  };
}
