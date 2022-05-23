import { test, expect } from "vitest";
import { addYears } from "date-fns";
import { decodeJwt } from "jose";
import Dp from "@webdino/profile-model/src/dp";
import { generateKey } from "./generate-key";
import { signDp } from "./sign-dp";

test("signDp() return a valid JWT", async () => {
  const issuedAt = new Date();
  const expiredAt = addYears(new Date(), 10);
  const dp: Dp = {
    issuedAt: issuedAt.toISOString(),
    expiredAt: expiredAt.toISOString(),
    issuer: "http://sub.localhost:8080",
    subject: "http://sub.localhost:8080/article/42",
    item: [],
  };
  const { pkcs8 } = await generateKey();
  const jwt = await signDp(dp, pkcs8);
  const valid = decodeJwt(jwt);
  expect(valid).toMatchObject({
    "https://opr.webdino.org/jwt/claims/dp": {
      item: dp.item,
    },
  });
});
