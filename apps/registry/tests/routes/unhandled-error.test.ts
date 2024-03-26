import { afterEach, beforeEach, expect, test } from "vitest";
import { Server, create } from "../../src/server";

let server: Server;

beforeEach(async () => {
  server = await create({
    isDev: false,
    quiet: true,
  });
});

afterEach(async () => {
  await server.close();
});

test("未処理の内部エラーは固定のレスポンスに置き換え", async () => {
  server.get("/unhandled-error", () => {
    throw new Error("INTERNAL ERROR");
  });

  await server.ready();

  const res = await server.inject("/unhandled-error");

  expect(res.json()).toEqual({
    statusCode: 500,
    error: "Internal Server Error",
    message: "An error occurred trying to process your request.",
  });
});
