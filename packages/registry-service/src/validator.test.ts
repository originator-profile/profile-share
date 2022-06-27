import { test, expect } from "vitest";
import { addYears } from "date-fns";
import { Op } from "@webdino/profile-model";
import { ValidatorService } from "./validator";

test("opValidate() return OP", () => {
  const validator = ValidatorService();
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
  const valid = validator.opValidate(op);
  expect(valid).toEqual(op);
});

test("jwkValidate() return JWK", () => {
  const validator = ValidatorService();
  const jwk = {
    kty: "EC",
    x: "qdRrcTMY91Y14wEjKK8vsRD0URAvp4_iUeuNccLRXNM",
    y: "hapsGeufcGFeTlpBqVDXue-Iu3aO12gd1T9pvzQYFwc",
    crv: "P-256",
  };
  const valid = validator.jwkValidate(jwk);
  expect(valid).toEqual(jwk);
});
