import { importPKCS8, SignJWT } from "jose";
import { getUnixTime } from "date-fns";
import { Dp, JwtDpPayload } from "@webdino/profile-model";
import { createThumbprint } from "./thumbprint";

/**
 * DP への署名
 * @param dp DP オブジェクト
 * @param pkcs8 PEM base64 でエンコードされた PKCS #8 プライベート鍵
 * @param alg Algorithm identifier
 * @return JWT でエンコードされた DP
 */
export async function signDp(
  dp: Dp,
  pkcs8: string,
  alg = "ES256"
): Promise<string> {
  const header = {
    alg,
    kid: await createThumbprint(pkcs8, alg),
    typ: "JWT",
  };
  const payload: Pick<JwtDpPayload, "https://originator-profile.org/dp"> = {
    "https://originator-profile.org/dp": {
      item: dp.item,
    },
  };
  const privateKey = await importPKCS8(pkcs8, alg);
  const jwt = await new SignJWT(payload)
    .setProtectedHeader(header)
    .setIssuer(dp.issuer)
    .setSubject(dp.subject)
    .setIssuedAt(getUnixTime(new Date(dp.issuedAt)))
    .setExpirationTime(getUnixTime(new Date(dp.expiredAt)))
    .sign(privateKey);
  return jwt;
}
