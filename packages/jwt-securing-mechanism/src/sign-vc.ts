import { createThumbprint } from "@originator-profile/cryptography";
import { OpVc } from "@originator-profile/abstract-model";
import { Jwk } from "@originator-profile/model";
import { getUnixTime } from "date-fns";
import { importJWK, SignJWT } from "jose";
import { mapToJwt } from "./mapping";

/**
 * VC への署名
 * @param cp CoreProfile オブジェクト
 * @param privateKey プライベート鍵
 * @return JWT でエンコードされた VC
 */
export async function signVc<T extends OpVc>(
  vc: T,
  privateKey: Jwk,
  options: {
    alg?: string;
    issuedAt: Date;
    expiredAt: Date;
  },
): Promise<string> {
  const payload = mapToJwt(vc);
  const { alg = "ES256", issuedAt, expiredAt } = options;
  const header = {
    alg,
    kid: privateKey.kid ?? (await createThumbprint(privateKey, alg)),
    typ: "vc+ld-jwt",
    cty: "vc",
  };

  const privateKeyImported = await importJWK(privateKey, alg);
  const jwt = await new SignJWT(payload)
    .setProtectedHeader(header)
    .setIssuer(vc.issuer)
    .setSubject(vc.credentialSubject.id)
    .setIssuedAt(getUnixTime(issuedAt))
    .setExpirationTime(getUnixTime(expiredAt))
    .sign(privateKeyImported);
  return jwt;
}
