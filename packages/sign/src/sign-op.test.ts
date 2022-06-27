import { test, expect } from "vitest";
import { addYears } from "date-fns";
import { decodeJwt } from "jose";
import { Op } from "@webdino/profile-model";
import { generateKey } from "./generate-key";
import { signOp } from "./sign-op";

test("signOp() return a valid JWT", async () => {
  const issuedAt = new Date();
  const expiredAt = addYears(new Date(), 10);
  const op: Op = {
    type: "op",
    issuedAt: issuedAt.toISOString(),
    expiredAt: expiredAt.toISOString(),
    issuer: "http://localhost:8080",
    subject: "http://sub.localhost:8080",
    item: [],
  };
  const { pkcs8 } = await generateKey();
  const jwt = await signOp(op, pkcs8);
  const valid = decodeJwt(jwt);
  expect(valid).toMatchObject({
    iss: op.issuer,
    sub: op.subject,
    "https://opr.webdino.org/jwt/claims/op": {
      item: op.item,
    },
  });
});
