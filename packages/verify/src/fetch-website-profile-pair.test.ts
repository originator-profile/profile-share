import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import { describe, beforeAll, afterEach, afterAll, test, expect } from "vitest";
import { Window } from "happy-dom";
import { JsonLdDocument } from "jsonld";
import { ProfilesFetchFailed } from "./errors";
import { fetchWebsiteProfilePair } from "./fetch-website-profile-pair";

const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe("fetch-website-profile-pair", () => {
  test("website Profile Pair のあるサイトで Profile Pair が得られる", async () => {
    const profileEndpoint = "https://example.com/.well-known/pp.json";
    const profiles: JsonLdDocument = {
      "@context": "https://originator-profile.org/context.jsonld",
      website: {
        op: {
          iss: "originator-profile.org",
          sub: "example.com",
          profile: "sop1...",
        },
        dp: {
          sub: "ca729848-9265-48bf-8e33-887a43ba34b9",
          profile: "sdp1...",
        },
      },
    };
    server.use(
      http.get(profileEndpoint, () => {
        const profiles: JsonLdDocument = {
          "@context": "https://originator-profile.org/context.jsonld",
          website: {
            op: {
              iss: "originator-profile.org",
              sub: "example.com",
              profile: "sop1...",
            },
            dp: {
              sub: "ca729848-9265-48bf-8e33-887a43ba34b9",
              profile: "sdp1...",
            },
          },
        };
        return HttpResponse.json(profiles);
      }),
    );

    const window = new Window({ url: "https://example.com" });
    window.document.body.innerHTML = `
<body></body>`;
    const result = await fetchWebsiteProfilePair(
      window.document as unknown as Document,
    );
    expect(result).toEqual(profiles);
  });

  test("website Profile Pair が設置されていないとき Profile Pair の取得に失敗", async () => {
    const profileEndpoint = "https://error.example.org/.well-known/pp.json";
    server.use(
      http.get(profileEndpoint, () => new HttpResponse(null, { status: 404 })),
    );

    const window = new Window({ url: "https://error.example.org" });
    window.document.body.innerHTML = `
    <body></body>`;
    const result = await fetchWebsiteProfilePair(
      window.document as unknown as Document,
    );
    expect(result).toBeInstanceOf(ProfilesFetchFailed);
    // @ts-expect-error result is ProfilesFetchFailed
    expect(result.cause).toBeInstanceOf(ProfilesFetchFailed);
    // @ts-expect-error result is ProfilesFetchFailed
    expect(result.cause.cause.message).toEqual("404");
  });

  test("website Profile Pair の JSON parse に失敗したときエラーが返る", async () => {
    const profileEndpoint = "https://error.example.org/.well-known/pp.json";
    server.use(
      http.get(profileEndpoint, () => HttpResponse.text("<html></html>")),
    );

    const window = new Window({ url: "https://not-json.example.org" });
    window.document.body.innerHTML = `
    <body></body>`;
    const result = await fetchWebsiteProfilePair(
      window.document as unknown as Document,
    );
    expect(result).toBeInstanceOf(ProfilesFetchFailed);
    // @ts-expect-error result is ProfilesFetchFailed
    expect(result.message).toContain("Error_WebsiteProfilePairNotFetched");
  });
});
