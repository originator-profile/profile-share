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

  console.info("OAuth callback route accessed");

  const query = getQuery(event);

  const codeVerifier = getCookie(event, "pkce_code_verifier");
  const expectedState = getCookie(event, "oauth_state");

  if (!codeVerifier) {
    console.error("codeVerifier not found");
    throw createError({
      statusCode: 403,
      message: "認証に失敗しました",
    });
  }

  if (!expectedState) {
    console.error("expectedState not found");
    throw createError({
      statusCode: 403,
      message: "認証に失敗しました",
    });
  }

  try {
    const currentUrl = new URL(REDIRECT_URI);
    Object.entries(query).forEach(([key, value]) => {
      if (typeof value === "string") {
        currentUrl.searchParams.set(key, value);
      }
    });

    // TODO: 削除
    console.log(
      "token parameters:",
      JSON.stringify(
        {
          ISSUER,
          AUTHORIZATION_ENDPOINT,
          TOKEN_ENDPOINT,
          CLIENT_ID,
          CLIENT_SECRET,
          REDIRECT_URI,
          currentUrl,
          codeVerifier,
          expectedState,
        },
        null,
        2,
      ),
    );

    const tokens = await client.authorizationCodeGrant(
      newOauthConfig(
        ISSUER,
        AUTHORIZATION_ENDPOINT,
        TOKEN_ENDPOINT,
        CLIENT_ID,
        CLIENT_SECRET,
      ),
      currentUrl,
      {
        pkceCodeVerifier: codeVerifier,
        expectedState: expectedState,
      },
    );

    // TODO: 削除
    console.log("tokens:", tokens);

    // 使用済みのcookieを削除
    deleteCookie(event, "pkce_code_verifier", {
      path: "/",
    });
    deleteCookie(event, "oauth_state", {
      path: "/",
    });

    return tokens;
  } catch (error) {
    console.error("Token exchange error:", error);
    throw createError({
      statusCode: 500,
      message: "トークン交換に失敗しました",
    });
  }
});
