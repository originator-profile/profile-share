import { afterAll, beforeAll, expect, test } from "vitest";
import {
  GenerateKeyPairResult,
  SignJWT,
  exportJWK,
  generateKeyPair,
} from "jose";
import { rest } from "msw";
import { SetupServer, setupServer } from "msw/node";
import { Server, create } from "../../src/server";

// Node.js v16 にまだ存在しない機能しないのでインポート
import structuredClone from "@ungap/structured-clone";

const originalEnv = structuredClone(process.env);

function resetEnv() {
  Object.assign(process.env, originalEnv);
}

Object.assign(process.env, {
  APP_URL: "https://opr.localhost/",
  AUTH0_DOMAIN: "idp.localhost",
});

afterAll(resetEnv);

let server: Server, idp: SetupServer, testKeyPair: GenerateKeyPairResult;

beforeAll(async () => {
  testKeyPair = await generateKeyPair("RS256");

  const jwks = {
    keys: [
      {
        alg: "RS256",
        kid: "TEST-KEY",
        ...(await exportJWK(testKeyPair.publicKey)),
      },
    ],
  };

  idp = setupServer(
    rest.get(
      // JWKSエンドポイントのモック
      `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
      (_, res, ctx) => {
        return res(ctx.json(jwks));
      },
    ),
  );

  idp.listen();
  server = await create({
    isDev: true,
    quiet: true,
  });
  await server.ready();
});

afterAll(async () => {
  idp.close();
  await server.close();
});

test("/internal以下のリソースはBearer認証によって保護されている", async () => {
  const missingPermissionToken = await new SignJWT({
    iss: `https://${process.env.AUTH0_DOMAIN}/`,
    sub: "alice",
    aud: [process.env.APP_URL as string],
    azp: "TEST-CLIENT",
    scope: "openid",
    permissions: [],
  })
    .setProtectedHeader({
      alg: "RS256",
      kid: "TEST-KEY",
    })
    .setIssuedAt()
    .setExpirationTime("1min")
    .sign(testKeyPair.privateKey);

  const res = await server.inject({
    path: "/internal/accounts/cd8f5f9f-e3e8-569f-87ef-f03c6cfc29bc/",
    headers: { authorization: `Bearer ${missingPermissionToken}` },
  });

  expect(res.statusCode).toBe(403);
  expect(res.statusMessage).toBe("Forbidden");
  expect(res.json()).toEqual({
    statusCode: 403,
    error: "Forbidden",
    message: "Insufficient permissions",
  });
});
