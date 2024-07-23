import { Jwks } from "@originator-profile/model";
import Ajv from "ajv";
import { expect, test } from "vitest";

test("/.well-known/jwt-vc-issuer response includes a valid JWKS", async () => {
  const res = await fetch("http://localhost:8080/.well-known/jwt-vc-issuer");
  const json = await res.json();
  const ajv = new Ajv();
  const valid = ajv.validate(Jwks, json.jwks);
  expect(valid).toBe(true);
});
