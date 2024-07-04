import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import { describe, beforeAll, afterAll, test, expect } from "vitest";
import { JsonLdDocument } from "jsonld";
import context from "@originator-profile/model/context.json";
import { expandProfileSet, expandProfilePairs } from "./expand-profile-set";

const server = setupServer(
  http.get("https://originator-profile.org/context.jsonld", () =>
    HttpResponse.json(context),
  ),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});
afterAll(() => {
  server.close();
});

describe("expand-profiles", () => {
  test("expand empty Profile Set", async () => {
    const profiles: JsonLdDocument = [];
    const result = await expandProfileSet(profiles);
    expect(result).toEqual({
      advertisers: [],
      publishers: [],
      main: [],
      profile: [],
    });
  });
  test("expand non-array Profile Set", async () => {
    const profiles: JsonLdDocument = {
      "@context": "https://originator-profile.org/context.jsonld",
      advertiser: [],
      publisher: "example.com",
      main: "example.com",
      profile: ["sop1...", "sdp1..."],
    };
    const result = await expandProfileSet(profiles);
    expect(result).toEqual({
      advertisers: [],
      publishers: ["example.com"],
      main: ["example.com"],
      profile: ["sop1...", "sdp1..."],
    });
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

describe("expand-profile-pairs", () => {
  test("expand empty Profile Pair", async () => {
    const profiles: JsonLdDocument = [];
    const result = await expandProfilePairs(profiles);
    expect(result).toEqual({
      ad: [],
      website: [],
    });
  });

  test("expand one website Profile Pair", async () => {
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
    ];

    const result = await expandProfilePairs(profiles);
    expect(result).toEqual({
      ad: [],
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
      ],
    });
  });

  test("expand malformed ad profile pair", async () => {
    const profiles: JsonLdDocument = [
      {
        "@context": "https://originator-profile.org/context.jsonld",
        ad: {
          op: {
            sub: "localhost",
            profile: "sop1...",
          },
          dp: {
            sub: "ca729848-9265-48bf-8e33-887a43ba34b9",
            profile: "sdp1...",
          },
        },
      },
    ];
    const result = await expandProfilePairs(profiles);
    expect(result).toEqual({
      ad: [],
      website: [],
    });
  });

  test("expand multiple ad Profile Pair", async () => {
    const profiles: JsonLdDocument = [
      {
        "@context": "https://originator-profile.org/context.jsonld",
        ad: {
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
        ad: {
          op: {
            iss: "oprdev.originator-profile.org",
            sub: "localhost",
            profile: "sop1...",
          },
          dp: {
            sub: "d6669a08-378f-46ed-b9a8-092e32b34049",
            profile: "sdp2...",
          },
        },
      },
    ];

    const result = await expandProfilePairs(profiles);
    expect(result).toEqual({
      ad: [
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
            profile: "sop1...",
          },
          dp: {
            sub: "d6669a08-378f-46ed-b9a8-092e32b34049",
            profile: "sdp2...",
          },
        },
      ],
      website: [],
    });
  });
});
