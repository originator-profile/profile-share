import { afterAll, beforeAll, expect, test } from "vitest";
import { generateKey } from "@originator-profile/sign";
import { Server, create } from "../../src/server";

let server: Server;

beforeAll(async () => {
  server = await create({
    isDev: true,
    quiet: true,
    dangerouslyDisabledAuth: true,
  });
  await server.ready();
});

afterAll(async () => {
  await server.close();
});

test("account.registerKeyはプライベート鍵の登録を許可しない", async () => {
  const { privateKey } = await generateKey();
  const res = await server.inject({
    method: "POST",
    path: "/internal/accounts/cd8f5f9f-e3e8-569f-87ef-f03c6cfc29bc/keys/",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ key: privateKey }),
  });

  expect(res.statusCode).toBe(400);
  expect(res.statusMessage).toBe("Bad Request");
  expect(res.json()).toEqual({
    statusCode: 400,
    error: "Bad Request",
    message: "Private key not allowed.",
  });
});
