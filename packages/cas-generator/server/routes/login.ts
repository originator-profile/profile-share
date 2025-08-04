import * as client from 'openid-client'
import {Configuration} from 'openid-client';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const ISSUER = config.ISSUER
  const AUTHORIZATION_ENDPOINT = config.AUTHORIZATION_ENDPOINT
  const CLIENT_ID = config.CLIENT_ID
  const CLIENT_SECRET = config.CLIENT_SECRET
  const REDIRECT_URI = config.REDIRECT_URI

  // 環境変数が設定されているかチェック
  if (!ISSUER || !AUTHORIZATION_ENDPOINT || !CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI){
    throw createError({
      statusCode: 500,
      message: "必要な環境変数が設定されていません",
    });
  }
  console.info("OAuth login route accessed");
  try {
    const oauthConfig = new Configuration(
      {
        issuer: ISSUER,
        authorization_endpoint: AUTHORIZATION_ENDPOINT
      },
      CLIENT_ID,
      {
        client_secret: CLIENT_SECRET
      }
    )

    const codeVerifier = client.randomPKCECodeVerifier();
    const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);

    // setCookie(event, 'code_verifier', codeVerifier, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    //   maxAge: 600 // 10 minutes
    // });

    const parameters: Record<string, string> = {
      redirect_uri: REDIRECT_URI,
      scope: 'openid',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    };

    if (!oauthConfig.serverMetadata().supportsPKCE()) {
      const state = client.randomState()
      parameters.state = state
    }

    const redirectTo = client.buildAuthorizationUrl(oauthConfig, parameters);
    console.log("Redirecting to authorization server:", redirectTo);

    return sendRedirect(event, redirectTo.href);
  } catch (error) {
    console.error("Login error:", error);
    throw createError({
      statusCode: 500,
      message: "ログインに失敗しました",
    });
  }
});
