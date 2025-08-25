import * as client from "openid-client";
import { newOauthConfig } from "../utils/oauthClient";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const ISSUER = config.ISSUER;
  const AUTHORIZATION_ENDPOINT = config.AUTHORIZATION_ENDPOINT;
  const TOKEN_ENDPOINT = config.TOKEN_ENDPOINT;
  const CLIENT_ID = config.CLIENT_ID;
  const CLIENT_SECRET = config.CLIENT_SECRET;
  const REDIRECT_URI = config.REDIRECT_URI;

  // 環境変数が設定されているかチェック
  if (
    !ISSUER ||
    !AUTHORIZATION_ENDPOINT ||
    !TOKEN_ENDPOINT ||
    !CLIENT_ID ||
    !CLIENT_SECRET ||
    !REDIRECT_URI
  ) {
    throw createError({
      statusCode: 500,
      message: "必要な環境変数が設定されていません",
    });
  }
  console.info("OAuth login route accessed");

  try {
    const oauthConfig = newOauthConfig(
      ISSUER,
      AUTHORIZATION_ENDPOINT,
      TOKEN_ENDPOINT,
      CLIENT_ID,
      CLIENT_SECRET,
    );

    const codeVerifier = client.randomPKCECodeVerifier();
    const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
    const state = client.randomState();

    // codeVerifierとstateをcookieに保存
    setCookie(event, "pkce_code_verifier", codeVerifier, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });

    setCookie(event, "oauth_state", state, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });

    const parameters: Record<string, string> = {
      redirect_uri: REDIRECT_URI,
      scope: "openid",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      nonce: client.randomNonce(),
      state: state,
    };

    const redirectTo = client.buildAuthorizationUrl(oauthConfig, parameters);

    return sendRedirect(event, redirectTo.href);
  } catch (error) {
    console.error("Login error:", error);
    throw createError({
      statusCode: 500,
      message: "ログインに失敗しました",
    });
  }
});
