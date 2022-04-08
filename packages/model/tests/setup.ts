import { afterAll, afterEach, beforeAll } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { rest } from "msw";
import { setupServer } from "msw/node";

const contextJson = await fs.readFile(
  path.resolve(__dirname, "../context.json")
);
const context = JSON.parse(contextJson.toString());
const endpoints = [
  rest.get("https://github.com/webdino/profile", (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(context));
  }),
];
const server = setupServer(...endpoints);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
