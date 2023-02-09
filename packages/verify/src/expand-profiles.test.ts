import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { describe, beforeEach, test, expect } from "vitest";
import { addYears, getUnixTime, fromUnixTime } from "date-fns";
import { JsonLdDocument } from "jsonld";
import { generateKey, signOp } from "@webdino/profile-sign";
import { Op } from "@webdino/profile-model";
import { expandProfiles } from "./expand-profiles";

describe("expand-profiles", async () => {
  const iat = getUnixTime(new Date());
  const exp = getUnixTime(addYears(new Date(), 10));
  const op: Op = {
    type: "op",
    issuedAt: fromUnixTime(iat).toISOString(),
    expiredAt: fromUnixTime(exp).toISOString(),
    issuer: "example.org",
    subject: "example.com",
    item: [],
  };
  const { pkcs8 } = await generateKey();
  const jwt = await signOp(op, pkcs8);
  const profiles: JsonLdDocument = {
    "@context": "https://oprdev.herokuapp.com/context",
    main: ["https://example.com/"],
    profile: [jwt],
  };

  beforeEach(() => {
    mockFetch.clearAll();
  });

  test("expand Profiles Set JSON-LD Document", async () => {
    mockGet("https://oprdev.herokuapp.com/context").willResolve({
      "@context": {
        op: "https://github.com/webdino/profile#",
        xsd: "http://www.w3.org/2001/XMLSchema#",
        main: { "@id": "op:main", "@type": "xsd:string" },
        profile: { "@id": "op:profile", "@type": "xsd:string" },
        publisher: { "@id": "op:publisher", "@type": "xsd:string" },
        advertiser: { "@id": "op:advertiser", "@type": "xsd:string" },
      },
    });
    const result = await expandProfiles(profiles);
    expect(result).toEqual({
      advertisers: [],
      publishers: [],
      main: ["https://example.com/"],
      profile: [jwt],
    });
  });
});
