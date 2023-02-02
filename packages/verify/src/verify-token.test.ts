import { test, expect } from "vitest";
import { addYears, getUnixTime, fromUnixTime } from "date-fns";
import { Op, Dp } from "@webdino/profile-model";
import { generateKey, signOp, signDp } from "@webdino/profile-sign";
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
  const { jwk, pkcs8 } = await generateKey();
  const decoder = TokenDecoder(null);
  const keys = LocalKeys({ keys: [jwk] });
  const verifier = TokenVerifier(keys, "http://localhost:8080", decoder);
  const jwt = await signOp(op, pkcs8);
  const result = await verifier(jwt);
  // @ts-expect-error assert
  expect(result.op).toEqual(op);
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
  const { jwk, pkcs8 } = await generateKey();
  const decoder = TokenDecoder(null);
  const keys = LocalKeys({ keys: [jwk] });
  const verifier = TokenVerifier(keys, "http://localhost:8080", decoder);
  const jwt = await signDp(dp, pkcs8);
  const result = await verifier(jwt);
  // @ts-expect-error assert
  expect(result.dp).toEqual(dp);
});
