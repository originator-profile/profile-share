import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { describe, beforeEach, test, expect } from "vitest";
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
    "@context": "https://oprdev.herokuapp.com/context",
    main: ["example.com"],
    profile: [jwt],
  };
  const profileEndpoint = "https://example.com/.well-known/ps.json";

  beforeEach(() => {
    mockFetch.clearAll();
    mockGet(profileEndpoint).willResolve(profiles);
  });

  test("有効なエンドポイント指定時 Profiles Set が得られる", async () => {
    const result = await fetchProfiles(profileEndpoint);
    expect(result).toEqual(profiles);
  });

  test("無効なエンドポイント指定時 Profiles Set の取得に失敗", async () => {
    const result = await fetchProfiles("");
    expect(result).toBeInstanceOf(ProfilesFetchFailed);
    // @ts-expect-error result is ProfilesFetchFailed
    expect(result.message).toBe(
      `プロファイルを取得できませんでした:\nInvalid URL`
    );
  });

  test("取得先に Profiles Set が存在しないとき Profiles Set の取得に失敗", async () => {
    mockGet(profileEndpoint).willFail({}, 404);
    const result = await fetchProfiles(profileEndpoint);
    expect(result).toBeInstanceOf(ProfilesFetchFailed);
    // @ts-expect-error result is ProfilesFetchFailed
    expect(result.message).toBe(
      `プロファイルを取得できませんでした:\nHTTP ステータスコード 404`
    );
  });
});
