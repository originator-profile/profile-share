import { getUnixTime } from "date-fns";
import { importJWK, SignJWT } from "jose";
import {
  Jwk,
  JwtOpPayload,
  Op,
  OriginatorProfile,
} from "@originator-profile/model";
import { createThumbprint } from "./thumbprint";
/**
 * OP への署名 (SD-JWT VC)
 * @param op OP オブジェクト
 * @param privateKey プライベート鍵
 * @param alg Algorithm identifier
 * @return SD-JWT VC でエンコードされた OP
 */
export async function signSdJwtOp(
  op: OriginatorProfile,
  privateKey: Jwk,
  alg = "ES256",
): Promise<string> {
  const header = {
    alg,
    kid: privateKey.kid ?? (await createThumbprint(privateKey, alg)),
    typ: "vc+sd-jwt",
  };

  const privateKeyImported = await importJWK(privateKey, alg);
  const jwt = await new SignJWT(op)
    .setProtectedHeader(header)
    .setIssuer(op.iss)
    .setSubject(op.sub)
    .setIssuedAt(op.iat)
    .setExpirationTime(op.exp)
    .sign(privateKeyImported);
  return jwt.concat("~");
}

/**
 * OP への署名 (JWT)
 * @deprecated
 * @param op OP オブジェクト
 * @param privateKey プライベート鍵
 * @param alg Algorithm identifier
 * @return JWT でエンコードされた OP
 */
export async function signOp(
  op: Op,
  privateKey: Jwk,
  alg = "ES256",
): Promise<string> {
  const header = {
    alg,
    kid: privateKey.kid ?? (await createThumbprint(privateKey, alg)),
    typ: "JWT",
  };
  const payload: Pick<JwtOpPayload, "https://originator-profile.org/op"> = {
    "https://originator-profile.org/op": {
      item: op.item,
      jwks: op.jwks,
    },
  };
  const privateKeyImported = await importJWK(privateKey, alg);
  const jwt = await new SignJWT(payload)
    .setProtectedHeader(header)
    .setIssuer(op.issuer)
    .setSubject(op.subject)
    .setIssuedAt(getUnixTime(new Date(op.issuedAt)))
    .setExpirationTime(getUnixTime(new Date(op.expiredAt)))
    .sign(privateKeyImported);
  return jwt;
}
