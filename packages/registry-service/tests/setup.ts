import { afterAll, afterEach, beforeAll } from "vitest";
import { rest } from "msw";
import context from "@webdino/profile-model/context.json";
import { setupServer } from "msw/node";

// TODO: `ReferenceError: location is not defined` になるので宣言しているが
//        おそらくmsw側の不具合と思うので後で要修正
globalThis.location = { origin: "https://originator-profile.org" } as Location;

const endpoints = [
  rest.get("https://originator-profile.org/context.jsonld", (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(context));
  }),
];
const server = setupServer(...endpoints);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
