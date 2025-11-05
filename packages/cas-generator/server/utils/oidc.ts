type OidcConfig = {
  authType: "oidc";
  provider: string;
  clientId: string;
  clientSec: string;
  authorizeUrl: string;
  tokenUrl: string;
  redirectUrl: string;
};

/**
 * OIDC config tokenをパースして、OidcConfigを返す
 * @param input OIDC:Base64の文字列
 * @returns OidcConfig
 */
export function parseOidcConfigToken(input: string): OidcConfig {
  const prefix = "OIDC:";
  const base64 = input.startsWith(prefix) ? input.slice(prefix.length) : input;
  const obj = JSON.parse(Buffer.from(base64, "base64").toString("utf8"));
  if (obj?.authType !== "oidc") {
    throw new Error("OIDC config token expected");
  }
  return obj as OidcConfig;
}
