import { Configuration } from "openid-client";

export const newOauthConfig = (
  ISSUER: string,
  AUTHORIZATION_ENDPOINT: string,
  TOKEN_ENDPOINT: string,
  CLIENT_ID: string,
  CLIENT_SECRET: string,
) => {
  const oauthConfig = new Configuration(
    {
      issuer: ISSUER,
      authorization_endpoint: AUTHORIZATION_ENDPOINT,
      token_endpoint: TOKEN_ENDPOINT,
    },
    CLIENT_ID,
    {
      client_secret: CLIENT_SECRET,
    },
  );

  return oauthConfig;
};
