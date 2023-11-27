import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { describe, beforeEach, afterEach, test, expect } from "vitest";
import { Window } from "happy-dom";
import { JsonLdDocument } from "jsonld";
import { ProfilesFetchFailed } from "./errors";
import { fetchWebsiteProfilePair } from "./fetch-website-profile-pair";

describe("fetch-website-profile-pair", async () => {
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
  const profileEndpoint = "https://example.com/.well-known/pp.json";

  beforeEach(() => {
    mockGet(profileEndpoint).willResolve(profiles);
    mockGet("https://error.example.org/.well-known/pp.json").willFail({}, 404);
  });

  afterEach(() => {
    mockFetch.clearAll();
  });

  test("Profile Pair のあるサイトで Profile Pair が得られる", async () => {
    const window = new Window({ url: "https://example.com" });
    window.document.body.innerHTML = `
<body></body>`;
    const result = await fetchWebsiteProfilePair(
      window.document as unknown as Document,
    );
    expect(result).toEqual(profiles);
  });

  test("Profile Pair が設置されていないとき Profile Pair の取得に失敗", async () => {
    const window = new Window({ url: "https://error.example.org" });
    window.document.body.innerHTML = `
    <body></body>`;
    const result = await fetchWebsiteProfilePair(
      window.document as unknown as Document,
    );
    expect(result).toBeInstanceOf(ProfilesFetchFailed);
    // @ts-expect-error result is ProfilesFetchFailed
    expect(result.message).toBe(`HTTP ステータスコード 404`);
  });
});
