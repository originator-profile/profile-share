import { afterAll, afterEach, beforeAll } from "vitest";
import { http, HttpResponse } from "msw";
import context from "@originator-profile/model/context.json";
import { setupServer } from "msw/node";

const endpoints = [
  http.get("https://originator-profile.org/context.jsonld", () => {
    return HttpResponse.json(context);
  }),
  http.get("https://example.org/.well-known/jwt-vc-issuer", () => {
    // 中身はダミー
    return HttpResponse.json({});
  }),
  http.get("https://example.com/integrity-target-text", () => {
    const binaryData = Buffer.from("Hello, world!\r\n", "utf-8");
    return HttpResponse.arrayBuffer(binaryData, {
      headers: { "Content-Type": "text/plain" },
    });
  }),
  http.get("https://example.com/integrity-target-json", () => {
    const binaryData = Buffer.from("{}", "utf-8");
    return HttpResponse.arrayBuffer(binaryData, {
      headers: { "Content-Type": "application/json" },
    });
  }),
  http.get("https://example.com/not-found", () => {
    return new HttpResponse(null, { status: 404 });
  }),
];
const server = setupServer(...endpoints);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
