import { importJWK, SignJWT } from "jose";
import { getUnixTime } from "date-fns";
import { Op, JwtOpPayload, Jwk } from "@originator-profile/model";
import { createThumbprint } from "./thumbprint";

/**
 * OP への署名
 * @param op OP オブジェクト
 * @param privateKeyJwk PEM base64 でエンコードされた PKCS #8 プライベート鍵
 * @param alg Algorithm identifier
 * @return JWT でエンコードされた OP
 */
export async function signOp(
  op: Op,
  privateKeyJwk: Jwk,
  alg = "ES256",
): Promise<string> {
  const header = {
    alg,
    kid: privateKeyJwk.kid ?? await createThumbprint(privateKeyJwk, alg),
    typ: "JWT",
  };
  const payload: Pick<JwtOpPayload, "https://originator-profile.org/op"> = {
    "https://originator-profile.org/op": {
      item: op.item,
      jwks: op.jwks,
    },
  };
  const privateKey = await importJWK(privateKeyJwk, alg);
  const jwt = await new SignJWT(payload)
    .setProtectedHeader(header)
    .setIssuer(op.issuer)
    .setSubject(op.subject)
    .setIssuedAt(getUnixTime(new Date(op.issuedAt)))
    .setExpirationTime(getUnixTime(new Date(op.expiredAt)))
    .sign(privateKey);
  return jwt;
}
