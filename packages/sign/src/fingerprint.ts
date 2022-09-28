import crypto from "node:crypto";

/**
 * 鍵指紋の取得
 * @param jwkOrPkcs8 JWKまたはPKCS#8秘密鍵
 * @return 鍵指紋
 */
export function fingerprint(jwkOrPkcs8: string | crypto.JsonWebKey): string {
  const publicKey: string | crypto.JsonWebKeyInput =
    typeof jwkOrPkcs8 === "string"
      ? jwkOrPkcs8
      : { format: "jwk" as const, key: jwkOrPkcs8 };

  return crypto
    .createHash("sha256")
    .update(
      crypto.createPublicKey(publicKey).export({ type: "spki", format: "der" })
    )
    .digest("base64url");
}
