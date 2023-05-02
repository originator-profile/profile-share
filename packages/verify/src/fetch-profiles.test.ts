import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { describe, beforeEach, afterEach, test, expect } from "vitest";
import { Window } from "happy-dom";
import { addYears, getUnixTime, fromUnixTime } from "date-fns";
import { JsonLdDocument } from "jsonld";
import { generateKey, signOp } from "@webdino/profile-sign";
import { Op } from "@webdino/profile-model";
import { fetchProfiles } from "./fetch-profiles";
import { ProfilesFetchFailed } from "./errors";

describe("fetch-profiles", async () => {
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
    "@context": "https://originator-profile.org/context.jsonld",
    main: ["example.com"],
    profile: [jwt],
  };
  const profileEndpoint = "https://example.com/.well-known/ps.json";

  beforeEach(() => {
    mockGet(profileEndpoint).willResolve(profiles);
  });

  afterEach(() => {
    mockFetch.clearAll();
  });

  test("有効なエンドポイント指定時 Profiles Set が得られる", async () => {
    const window = new Window();
    window.document.body.innerHTML = `
<link
  href="${profileEndpoint}"
  rel="alternate"
  type="application/ld+json"
/>`;
    const result = await fetchProfiles(window.document as unknown as Document);
    expect(result).toEqual([profiles]);
  });

  test("無効なエンドポイント指定時 Profiles Set の取得に失敗", async () => {
    const window = new Window();
    window.document.body.innerHTML = `
<link
  href=""
  rel="alternate"
  type="application/ld+json"
/>`;
    const result = await fetchProfiles(window.document as unknown as Document);
    expect(result).toBeInstanceOf(ProfilesFetchFailed);
    // @ts-expect-error result is ProfilesFetchFailed
    expect(result.message).toBe(
      `プロファイルを取得できませんでした:\nInvalid URL`
    );
  });

  test("取得先に Profiles Set が存在しないとき Profiles Set の取得に失敗", async () => {
    mockGet(profileEndpoint).willFail({}, 404);
    const window = new Window();
    window.document.body.innerHTML = `
<link
  href="${profileEndpoint}"
  rel="alternate"
  type="application/ld+json"
/>`;
    const result = await fetchProfiles(window.document as unknown as Document);
    expect(result).toBeInstanceOf(ProfilesFetchFailed);
    // @ts-expect-error result is ProfilesFetchFailed
    expect(result.message).toBe(
      `プロファイルを取得できませんでした:\nHTTP ステータスコード 404`
    );
  });

  describe("<link> 要素が2つ以上存在するとき", async () => {
    beforeEach(() => {
      mockGet("https://example.com/1/ps.json").willResolve({
        "@context": "https://originator-profile.org/context.jsonld",
        profiles: "{Signed Document Profile または Signed Originator Profile}",
      });
      mockGet("https://example.com/2/ps.json").willResolve({
        "@context": "https://originator-profile.org/context.jsonld",
        profiles:
          "{別の Signed Document Profile または Signed Originator Profile}",
      });
    });

    test("有効な Profiles Set が得られる", async () => {
      const window = new Window();
      const profileEndpoints = [
        "https://example.com/1/ps.json",
        "https://example.com/2/ps.json",
      ];
      window.document.body.innerHTML = profileEndpoints
        .map(
          (endpoint) => `
<link
  href="${endpoint}"
  rel="alternate"
  type="application/ld+json"
/>
  `
        )
        .join("");
      const result = await fetchProfiles(
        window.document as unknown as Document
      );
      expect(result).not.toBeInstanceOf(ProfilesFetchFailed);
      expect(result).toMatchSnapshot();
    });
  });
});
