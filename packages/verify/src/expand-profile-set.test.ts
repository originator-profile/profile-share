import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { describe, beforeEach, afterEach, test, expect } from "vitest";
import { JsonLdDocument } from "jsonld";
import context from "@webdino/profile-model/context.json";
import { expandProfileSet } from "./expand-profile-set";

describe("expand-profiles", async () => {
  beforeEach(() => {
    mockGet("https://originator-profile.org/context.jsonld").willResolve(
      context
    );
  });

  afterEach(() => {
    mockFetch.clearAll();
  });

  test("expand Profile Set JSON-LD Document", async () => {
    const profiles: JsonLdDocument = [
      {
        "@context": "https://originator-profile.org/context.jsonld",
        advertiser: [],
        publisher: "example.com",
        main: "example.com",
        profile: ["sop1...", "sdp1..."],
      },
      {
        "@context": "https://originator-profile.org/context.jsonld",
        advertiser: "example",
        profile: ["sop2...", "sdp2..."],
      },
    ];
    const result = await expandProfileSet(profiles);
    expect(result).toEqual({
      advertisers: ["example"],
      publishers: ["example.com"],
      main: ["example.com"],
      profile: ["sop1...", "sdp1...", "sop2...", "sdp2..."],
    });
  });
});
