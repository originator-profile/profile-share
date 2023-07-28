import { test, expect } from "vitest";
import { addYears } from "date-fns";
import { decodeJwt, decodeProtectedHeader } from "jose";
import { Op } from "@originator-profile/model";
import { generateKey } from "./generate-key";
import { signOp } from "./sign-op";

test("signOp() return a valid JWT", async () => {
  const issuedAt = new Date();
  const expiredAt = addYears(new Date(), 10);
  const op: Op = {
    type: "op",
    issuedAt: issuedAt.toISOString(),
    expiredAt: expiredAt.toISOString(),
    issuer: "example.org",
    subject: "example.com",
    item: [],
  };
  const { publicKey, privateKey } = await generateKey();
  const jwt = await signOp(op, privateKey);
  expect(decodeProtectedHeader(jwt).kid).toBe(publicKey.kid);
  const valid = decodeJwt(jwt);
  expect(valid).toMatchObject({
    iss: op.issuer,
    sub: op.subject,
    "https://originator-profile.org/op": {
      item: op.item,
    },
  });
});
