import { importJWK, SignJWT } from "jose";
import { createThumbprint } from "@originator-profile/cryptography";
import { Jwk, OriginatorProfile } from "@originator-profile/model";

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
