import { afterAll, afterEach, beforeAll } from "vitest";
import { http, HttpResponse } from "msw";
import context from "@originator-profile/model/context.json";
import { setupServer } from "msw/node";

const endpoints = [
  http.get("https://originator-profile.org/context.jsonld", () => {
    return HttpResponse.json(context);
  }),
  http.get("https://example.com/integrity-target-text", () => {
    return new HttpResponse("Hello, world!\r\n");
  }),
  http.get("https://example.com/integrity-target-json", () => {
    return HttpResponse.json({});
  }),
  http.get("https://example.com/not-found", () => {
    return new HttpResponse(null, { status: 404 });
  }),
];
const server = setupServer(...endpoints);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
