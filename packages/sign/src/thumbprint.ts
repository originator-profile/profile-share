import { calculateJwkThumbprint, exportJWK, importPKCS8, JWK } from "jose";

/**
 * SHA-256ハッシュで計算されるJWK Thumbprintの作成
 * https://datatracker.ietf.org/doc/html/rfc7638
 * @param jwkOrPkcs8 JWKまたはPKCS#8プライベート鍵
 * @param alg PKCS#8プライベート鍵のアルゴリズム識別子
 * @return SHA-256ハッシュで計算されるJWK Thumbprint
 */
export async function createThumbprint(
  jwkOrPkcs8: string | JWK,
  alg = "ES256",
): Promise<string> {
  const jwk: JWK =
    typeof jwkOrPkcs8 === "string"
      ? await importPKCS8(jwkOrPkcs8, alg).then(exportJWK)
      : jwkOrPkcs8;

  const thumbprint = await calculateJwkThumbprint(jwk, "sha256");
  return thumbprint;
}
