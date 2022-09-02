import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { describe, beforeEach, test, expect } from "vitest";
import { addYears, getUnixTime, fromUnixTime } from "date-fns";
import { JsonLdDocument } from "jsonld";
import { generateKey, signOp } from "@webdino/profile-sign";
import { Op } from "@webdino/profile-model";
import { fetchProfiles } from "./fetch-profiles";

describe("fetch-profiles", async () => {
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
  const profiles: JsonLdDocument = {
    "@context": "https://oprdev.herokuapp.com/context",
    main: ["http://sub.localhost:8080"],
    profile: [jwt],
  };

  beforeEach(() => {
    mockFetch.clearAll();
    mockGet("http://localhost:8080/.well-known/op-document").willResolve(
      profiles
    );
  });

  test("オリジン指定時適切な Profiles Set と well-known エンドポイントが得られる", async () => {
    const result = await fetchProfiles("http://localhost:8080", null);
    expect(result).toEqual({
      profiles,
      profileEndpoint: new URL("http://localhost:8080/.well-known/op-document"),
    });
  });

  test("エンドポイント指定時適切な Profiles Set とエンドポイントが得られる", async () => {
    const result = await fetchProfiles(
      "",
      "http://localhost:8080/.well-known/op-document"
    );
    expect(result).toEqual({
      profiles,
      profileEndpoint: new URL("http://localhost:8080/.well-known/op-document"),
    });
  });

  test("オリジンとエンドポイントのいずれも未指定のとき Profiles Set の取得に失敗", async () => {
    expect(fetchProfiles("", null)).rejects.toThrowError(
      /^プロファイルを取得できませんでした:\nInvalid URL$/
    );
  });

  test("取得先に Profiles Set が存在しないとき Profiles Set の取得に失敗", async () => {
    mockGet("http://localhost:8080/.well-known/op-document").willFail({}, 404);
    expect(fetchProfiles("http://localhost:8080", null)).rejects.toThrowError(
      /^プロファイルを取得できませんでした:\nHTTP ステータスコード 404$/
    );
  });
});
