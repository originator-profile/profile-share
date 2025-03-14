import { test, expect } from "vitest";
import { ValidatorService } from "./validator";

test("jwkValidate() return JWK", () => {
  const validator = ValidatorService();
  const jwk = {
    kid: "pFZjqcvvx0zPQNalRuiWVy1Asr6iEqn2DVVJ2Z_0RXw",
    kty: "EC",
    x: "qdRrcTMY91Y14wEjKK8vsRD0URAvp4_iUeuNccLRXNM",
    y: "hapsGeufcGFeTlpBqVDXue-Iu3aO12gd1T9pvzQYFwc",
    crv: "P-256",
  };
  const valid = validator.jwkValidate(jwk);
  expect(valid).toEqual(jwk);
});
