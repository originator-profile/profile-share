import { afterAll, afterEach, beforeAll } from "vitest";
import { http, HttpResponse } from "msw";
import context from "@originator-profile/model/context.json";
import { setupServer } from "msw/node";

const endpoints = [
  http.get("https://originator-profile.org/context.jsonld", () => {
    return HttpResponse.json(context);
  }),
];
const server = setupServer(...endpoints);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
