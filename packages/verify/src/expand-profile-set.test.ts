import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { describe, beforeEach, afterEach, test, expect } from "vitest";
import { JsonLdDocument } from "jsonld";
import context from "@originator-profile/model/context.json";
import { expandProfileSet } from "./expand-profile-set";

describe("expand-profiles", async () => {
  beforeEach(() => {
    mockGet("https://originator-profile.org/context.jsonld").willResolve(
      context,
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
      ad: [],
      advertisers: ["example"],
      publishers: ["example.com"],
      main: ["example.com"],
      profile: ["sop1...", "sdp1...", "sop2...", "sdp2..."],
      website: [],
    });
  });

  test("expand website Profile Pair", async () => {
    const profiles: JsonLdDocument = [
      {
        "@context": "https://originator-profile.org/context.jsonld",
        website: {
          op: {
            iss: "oprdev.originator-profile.org",
            sub: "localhost",
            profile: "sop1...",
          },
          dp: {
            sub: "ca729848-9265-48bf-8e33-887a43ba34b9",
            profile: "sdp1...",
          },
        },
      },
      {
        "@context": "https://originator-profile.org/context.jsonld",
        website: {
          op: {
            iss: "oprdev.originator-profile.org",
            sub: "localhost",
            profile: "sop2...",
          },
          dp: {
            sub: "ca729848-9265-48bf-8e33-887a43ba34b9",
            profile: "sdp2...",
          },
        },
      },
    ];

    const result = await expandProfileSet(profiles);
    expect(result).toEqual({
      ad: [],
      advertisers: [],
      publishers: [],
      main: [],
      profile: [],
      website: [
        {
          op: {
            iss: "oprdev.originator-profile.org",
            sub: "localhost",
            profile: "sop1...",
          },
          dp: {
            sub: "ca729848-9265-48bf-8e33-887a43ba34b9",
            profile: "sdp1...",
          },
        },
        {
          op: {
            iss: "oprdev.originator-profile.org",
            sub: "localhost",
            profile: "sop2...",
          },
          dp: {
            sub: "ca729848-9265-48bf-8e33-887a43ba34b9",
            profile: "sdp2...",
          },
        },
      ],
    });
  });
});
