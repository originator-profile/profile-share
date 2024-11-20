import { Jwks } from "@originator-profile/model";
import Ajv from "ajv";
import { expect, test } from "vitest";

test("/.well-known/jwks.json response is a valid JWKS", async () => {
  const res = await fetch("http://localhost:8080/.well-known/jwks.json");
  const json = await res.json();
  const ajv = new Ajv();
  const valid = ajv.validate(Jwks, json);
  expect(valid).toBe(true);
});
