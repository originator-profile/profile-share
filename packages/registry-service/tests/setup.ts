import { afterAll, afterEach, beforeAll } from "vitest";
import { rest } from "msw";
import context from "@webdino/profile-model/context.json";

// TODO: `SyntaxError: Named export 'Headers' not found. The requested module 'headers-polyfill' is a CommonJS module, which may not support all module.exports as named exports.`
//        mswのCommonJS依存関係が取り取り除かれれば修正する
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { setupServer } = require("msw/node");

// TODO: `ReferenceError: location is not defined` になるので宣言しているが
//        おそらくmsw側の不具合と思うので後で要修正
globalThis.location = { origin: "https://oprdev.herokuapp.com" } as Location;

const endpoints = [
  rest.get("https://oprdev.herokuapp.com/context", (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(context));
  }),
];
const server = setupServer(...endpoints);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
