import { afterAll, afterEach, beforeAll } from "vitest";
import { rest } from "msw";
import { setupServer } from "msw/node";
import context from "@webdino/profile-model/context.json";

const endpoints = [
  rest.get("https://github.com/webdino/profile", (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(context));
  }),
];
const server = setupServer(...endpoints);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
