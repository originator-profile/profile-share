import { test, expect } from "vitest";
import { addYears } from "date-fns";
import { decodeJwt, decodeProtectedHeader } from "jose";
import { Dp } from "@webdino/profile-model";
import { generateKey } from "./generate-key";
import { signDp } from "./sign-dp";

test("signDp() return a valid JWT", async () => {
  const issuedAt = new Date();
  const expiredAt = addYears(new Date(), 10);
  const dp: Dp = {
    type: "dp",
    issuedAt: issuedAt.toISOString(),
    expiredAt: expiredAt.toISOString(),
    issuer: "example.com",
    subject: "https://example.com/article/42",
    item: [],
  };
  const { jwk, pkcs8 } = await generateKey();
  const jwt = await signDp(dp, pkcs8);
  expect(decodeProtectedHeader(jwt).kid).toBe(jwk.kid);
  const valid = decodeJwt(jwt);
  expect(valid).toMatchObject({
    "https://originator-profile.org/dp": {
      item: dp.item,
    },
  });
});
