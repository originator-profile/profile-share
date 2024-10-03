import { afterAll, beforeAll, expect, test } from "vitest";
import { Server, create } from "../../src/server";

const originalEnv = structuredClone(process.env);

function resetEnv() {
  Object.assign(process.env, originalEnv);
}

Object.assign(process.env, {
  BASIC_AUTH: "true",
  BASIC_AUTH_USERNAME: "alice",
  BASIC_AUTH_PASSWORD: crypto.randomUUID(),
});

afterAll(resetEnv);

let server: Server;

beforeAll(async () => {
  server = await create({
    isDev: true,
    quiet: true,
  });
  await server.ready();
});

afterAll(async () => {
  await server.close();
});

test("Basic認証によって保護されている", async () => {
  const res = await server.inject({
    path: "/",
    headers: { authorization: `Basic ${btoa("alice:invalid-password")}` },
  });

  expect(res.statusCode).toBe(401);
  expect(res.statusMessage).toBe("Unauthorized");
  expect(res.json()).toEqual({
    statusCode: 401,
    error: "Unauthorized",
    message: "Invalid password",
  });
});
