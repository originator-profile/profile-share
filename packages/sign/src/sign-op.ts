import { importPKCS8, SignJWT } from "jose";
import { getUnixTime } from "date-fns";
import Op from "@webdino/profile-model/src/op";
import { JwtOpPayload } from "./claims";

/**
 * OP への署名
 * @param op OP オブジェクト
 * @param pkcs8 PEM base64 でエンコードされた PKCS #8 秘密鍵
 * @param alg Algorithm identifier
 * @return JWT でエンコードされた OP
 */
export async function signOp(
  op: Op,
  pkcs8: string,
  alg = "ES256"
): Promise<string> {
  const header = {
    alg,
    typ: "JWT",
  };
  const payload: Pick<JwtOpPayload, "https://opr.webdino.org/jwt/claims/op"> = {
    "https://opr.webdino.org/jwt/claims/op": {
      item: op.item,
      jwks: op.jwks,
    },
  };
  const privateKey = await importPKCS8(pkcs8, alg);
  const jwt = await new SignJWT(payload)
    .setProtectedHeader(header)
    .setIssuer(op.issuer)
    .setSubject(op.subject)
    .setIssuedAt(getUnixTime(new Date(op.issuedAt)))
    .setExpirationTime(getUnixTime(new Date(op.expiredAt)))
    .sign(privateKey);
  return jwt;
}
