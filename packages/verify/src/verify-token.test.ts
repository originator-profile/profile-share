import { test, expect } from "vitest";
import { addYears, getUnixTime, fromUnixTime } from "date-fns";
import { Op, Dp } from "@originator-profile/model";
import { signOp, signDp, generateKey } from "@originator-profile/sign";
import { ProfileTokenVerifyFailed } from "./errors";
import { TokenDecoder } from "./decode";
import { LocalKeys } from "./keys";
import { TokenVerifier } from "./verify-token";

test("verify OP Token", async () => {
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
  const { publicKey, privateKey } = await generateKey();
  const decoder = TokenDecoder(null);
  const keys = LocalKeys({ keys: [publicKey] });
  const verifier = TokenVerifier(keys, "example.org", decoder);
  const jwt = await signOp(op, privateKey);
  const result = await verifier(jwt);
  // @ts-expect-error assert
  expect(result.op).toEqual(op);
});

test("OP Token の issuer が検証者にとって未知ならば検証に失敗", async () => {
  const iat = getUnixTime(new Date());
  const exp = getUnixTime(addYears(new Date(), 10));
  const op: Op = {
    type: "op",
    issuedAt: fromUnixTime(iat).toISOString(),
    expiredAt: fromUnixTime(exp).toISOString(),
    issuer: "evil.example.org",
    subject: "example.com",
    item: [],
  };
  const { publicKey, privateKey } = await generateKey();
  const decoder = TokenDecoder(null);
  const keys = LocalKeys({ keys: [publicKey] });
  const verifier = TokenVerifier(keys, "example.org", decoder);
  const jwt = await signOp(op, privateKey);
  const result = await verifier(jwt);
  expect(result).toBeInstanceOf(ProfileTokenVerifyFailed);
});

test("verify DP Token", async () => {
  const iat = getUnixTime(new Date());
  const exp = getUnixTime(addYears(new Date(), 10));
  const dp: Dp = {
    type: "dp",
    issuedAt: fromUnixTime(iat).toISOString(),
    expiredAt: fromUnixTime(exp).toISOString(),
    issuer: "example.com",
    subject: "https://example.com/article/42",
    item: [],
  };
  const { publicKey, privateKey } = await generateKey();
  const decoder = TokenDecoder(null);
  const keys = LocalKeys({ keys: [publicKey] });
  const verifier = TokenVerifier(keys, "example.com", decoder);
  const jwt = await signDp(dp, privateKey);
  const result = await verifier(jwt);
  // @ts-expect-error assert
  expect(result.dp).toEqual(dp);
});

test("DP Token の issuer が検証者にとって未知ならば検証に失敗", async () => {
  const iat = getUnixTime(new Date());
  const exp = getUnixTime(addYears(new Date(), 10));
  const dp: Dp = {
    type: "dp",
    issuedAt: fromUnixTime(iat).toISOString(),
    expiredAt: fromUnixTime(exp).toISOString(),
    issuer: "evil.example.com",
    subject: "https://example.com/article/42",
    item: [],
  };
  const { publicKey, privateKey } = await generateKey();
  const decoder = TokenDecoder(null);
  const keys = LocalKeys({ keys: [publicKey] });
  const verifier = TokenVerifier(keys, "example.com", decoder);
  const jwt = await signDp(dp, privateKey);
  const result = await verifier(jwt);
  expect(result).toBeInstanceOf(ProfileTokenVerifyFailed);
});
