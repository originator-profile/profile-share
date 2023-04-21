import { afterAll, afterEach, beforeAll } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { rest } from "msw";
import { setupServer } from "msw/node";

// TODO: `ReferenceError: location is not defined` になるので宣言しているが
//        おそらくmsw側の不具合と思うので後で要修正
globalThis.location = { origin: "https://oprdev.herokuapp.com" } as Location;

const contextJson = await fs.readFile(
  path.resolve(__dirname, "../context.json")
);
const context = JSON.parse(contextJson.toString());
const endpoints = [
  rest.get("https://oprdev.herokuapp.com/context", (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(context));
  }),
];
const server = setupServer(...endpoints);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
