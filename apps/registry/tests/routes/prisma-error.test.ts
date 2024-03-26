import { afterEach, beforeEach, expect, test } from "vitest";
import { stdout } from "stdout-stderr";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Server, create } from "../../src/server";

let server: Server;

beforeEach(async () => {
  server = await create({
    isDev: false,
    quiet: false,
  });
});

afterEach(async () => {
  await server.close();
});

test("PrismaClientKnownRequestErrorエラーはBadRequestErrorに置き換え", async () => {
  server.addHook("preHandler", () => {
    throw new PrismaClientKnownRequestError(
      "PrismaClientKnownRequestError message",
      {
        code: "P2xx",
        clientVersion: "0.0.0",
      },
    );
  });

  await server.ready();

  const res = await server.inject("/.well-known/ps.json");

  expect(stdout.output).toMatch(`"PrismaClientKnownRequestError message"`);
  expect(res.json()).toEqual({
    statusCode: 400,
    error: "Bad Request",
    message: "PrismaClientKnownRequestError: P2xx",
  });
});
