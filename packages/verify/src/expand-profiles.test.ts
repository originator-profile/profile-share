import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { describe, beforeEach, afterEach, test, expect } from "vitest";
import { JsonLdDocument } from "jsonld";
import context from "@webdino/profile-model/context.json";
import { expandProfiles } from "./expand-profiles";

describe("expand-profiles", async () => {
  beforeEach(() => {
    mockGet("https://oprdev.herokuapp.com/context").willResolve(context);
  });

  afterEach(() => {
    mockFetch.clearAll();
  });

  test("expand Profiles Set JSON-LD Document", async () => {
    const profiles: JsonLdDocument = [
      {
        "@context": "https://oprdev.herokuapp.com/context",
        advertiser: [],
        publisher: "example.com",
        main: "example.com",
        profile: ["sop1...", "sdp1..."],
      },
      {
        "@context": "https://oprdev.herokuapp.com/context",
        advertiser: "example",
        profile: ["sop2...", "sdp2..."],
      },
    ];
    const result = await expandProfiles(profiles);
    expect(result).toEqual({
      advertisers: ["example"],
      publishers: ["example.com"],
      main: ["example.com"],
      profile: ["sop1...", "sdp1...", "sop2...", "sdp2..."],
    });
  });
});
