import { describe, test, expect } from "vitest";
import { addYears, getUnixTime, fromUnixTime } from "date-fns";
import { JsonLdDocument } from "jsonld";
import { generateKey, signOp } from "@webdino/profile-sign";
import { Op } from "@webdino/profile-model";
import { expandProfileDocument } from "./expand-profile-document";

describe("expand-profiles-document", async () => {
  const iat = getUnixTime(new Date());
  const exp = getUnixTime(addYears(new Date(), 10));
  const op: Op = {
    type: "op",
    issuedAt: fromUnixTime(iat).toISOString(),
    expiredAt: fromUnixTime(exp).toISOString(),
    issuer: "http://localhost:8080",
    subject: "http://sub.localhost:8080",
    item: [],
  };
  const { pkcs8 } = await generateKey();
  const jwt = await signOp(op, pkcs8);
  const profileDocument: JsonLdDocument = {
    "@context": "https://oprdev.herokuapp.com/context",
    main: ["http://sub.localhost:8080"],
    profile: [jwt],
  };

  test("expand Profile Document to Profile Set", async () => {
    const result = await expandProfileDocument(profileDocument);
    expect(result).toEqual({
      advertisers: [],
      publishers: [],
      main: ["http://sub.localhost:8080"],
      profile: [jwt],
    });
  });
});
