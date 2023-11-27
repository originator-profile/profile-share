import { importJWK, SignJWT } from "jose";
import { getUnixTime } from "date-fns";
import { Dp, Jwk, JwtDpPayload } from "@originator-profile/model";
import { createThumbprint } from "./thumbprint";

/**
 * DP への署名
 * @param dp DP オブジェクト
 * @param privateKey プライベート鍵
 * @param alg Algorithm identifier
 * @return JWT でエンコードされた DP
 */
export async function signDp(
  dp: Dp,
  privateKey: Jwk,
  alg = "ES256",
): Promise<string> {
  const header = {
    alg,
    kid: await createThumbprint(privateKey, alg),
    typ: "JWT",
  };
  const payload: Pick<JwtDpPayload, "https://originator-profile.org/dp"> = {
    "https://originator-profile.org/dp": {
      item: dp.item,
      allowedOrigins: dp.allowedOrigins,
    },
  };
  const privateKeyImported = await importJWK(privateKey, alg);
  const jwt = await new SignJWT(payload)
    .setProtectedHeader(header)
    .setIssuer(dp.issuer)
    .setSubject(dp.subject)
    .setIssuedAt(getUnixTime(new Date(dp.issuedAt)))
    .setExpirationTime(getUnixTime(new Date(dp.expiredAt)))
    .sign(privateKeyImported);
  return jwt;
}
