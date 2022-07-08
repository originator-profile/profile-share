import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { describe, beforeEach, test, expect } from "vitest";
import { addYears, getUnixTime, fromUnixTime } from "date-fns";
import { JsonLdDocument } from "jsonld";
import { generateKey, signOp } from "@webdino/profile-sign";
import { Op } from "@webdino/profile-model";
import { fetchProfileDocument } from "./fetch-profile-document";

describe("fetch-profiles-document", async () => {
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

  beforeEach(() => {
    mockFetch.clearAll();
  });

  test("オリジン指定時適切なProfile Documentとwell-knownエンドポイントが得られる", async () => {
    mockGet("http://localhost:8080/.well-known/op-document").willResolve(
      profileDocument
    );
    const result = await fetchProfileDocument("http://localhost:8080");
    expect(result).toEqual({
      profileDocument,
      profileEndpoint: new URL("http://localhost:8080/.well-known/op-document"),
    });
  });

  test("エンドポイント指定時適切なProfile Documentとエンドポイントが得られる", async () => {
    mockGet("http://localhost:8080/.well-known/op-document").willResolve(
      profileDocument
    );
    const result = await fetchProfileDocument(
      undefined,
      "http://localhost:8080/.well-known/op-document"
    );
    expect(result).toEqual({
      profileDocument,
      profileEndpoint: new URL("http://localhost:8080/.well-known/op-document"),
    });
  });
});
