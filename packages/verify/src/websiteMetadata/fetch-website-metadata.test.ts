import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import { beforeAll, afterEach, afterAll, test, expect } from "vitest";
import { Window } from "happy-dom";
import { fetchWebsiteMetadata } from "./fetch-website-metadata";
import {
  WebAssertionSet,
  SingleWebAssertionSet,
} from "@originator-profile/model";
import { WebsiteMetadataFetchFailed, WebsiteMetadataInvalid } from "./errors";

const server = setupServer();

const metadata: SingleWebAssertionSet = {
  type: "was",
  originator: "op",
  certificates: ["certificate"],
  assertions: ["assertion"],
  main: false,
};

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

test("Website Metadata のあるサイトで Website Metadata が得られる", async () => {
  const endpoint = "https://example.com/.well-known/was.json";
  server.use(
    http.get(endpoint, () => {
      return HttpResponse.json(metadata);
    }),
  );

  const window = new Window({ url: "https://example.com" });
  window.document.body.innerHTML = `
<body></body>`;
  const result = await fetchWebsiteMetadata(
    window.document as unknown as Document,
  );
  expect(result).toEqual({ ok: true, result: metadata });
});

test("複数の Web Assertion Set を提示されたとき無効", async () => {
  const endpoint = "https://example.com/.well-known/was.json";
  const webAssertionSet: WebAssertionSet = [metadata];
  server.use(
    http.get(endpoint, () => {
      return HttpResponse.json(webAssertionSet);
    }),
  );

  const window = new Window({ url: "https://example.com" });
  window.document.body.innerHTML = `
<body></body>`;
  const result = await fetchWebsiteMetadata(
    window.document as unknown as Document,
  );
  expect(result).toBeInstanceOf(WebsiteMetadataInvalid);
});

test("Website Metadata が設置されていないとき Website Metadata の取得に失敗", async () => {
  const endpoint = "https://error.example.org/.well-known/was.json";
  server.use(http.get(endpoint, () => new HttpResponse(null, { status: 404 })));

  const window = new Window({ url: "https://error.example.org" });
  window.document.body.innerHTML = ` <body></body>`;
  const result = await fetchWebsiteMetadata(
    window.document as unknown as Document,
  );
  expect(result).toBeInstanceOf(WebsiteMetadataFetchFailed);
  // @ts-expect-error result is WebsiteMetadataFetchFailed
  expect(result.message).toBe(`HTTP ステータスコード 404`);
});

test("Website Metadata の JSON parse に失敗したときエラーが返る", async () => {
  const profileEndpoint = "https://error.example.org/.well-known/pp.json";
  server.use(
    http.get(profileEndpoint, () => HttpResponse.text("<html></html>")),
  );

  const window = new Window({ url: "https://not-json.example.org" });
  window.document.body.innerHTML = `
    <body></body>`;
  const result = await fetchWebsiteMetadata(
    window.document as unknown as Document,
  );
  expect(result).toBeInstanceOf(WebsiteMetadataFetchFailed);
  // @ts-expect-error result is WebsiteMetadataFetchFailed
  expect(result.message).toContain(`Website Metadata を取得できませんでした:`);
});
