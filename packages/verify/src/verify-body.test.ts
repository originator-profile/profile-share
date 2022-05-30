import { test, expect } from "vitest";
import { generateKey, signBody } from "@webdino/profile-sign";
import { verifyBody } from "./verify-body";
import { LocalKeys } from "./keys";

test("verify body", async () => {
  const body = "Hello, world!";
  const alg = "ES256";
  const { jwk, pkcs8 } = await generateKey(alg);
  const jws = await signBody(body, pkcs8);
  const keys = LocalKeys({ keys: [jwk] });
  const result = await verifyBody(body, jws, keys);
  expect(result).not.instanceOf(Error);
  // @ts-expect-error assert
  expect(result.payload).toEqual(new TextEncoder().encode(body));
});

test("invalid body", async () => {
  const body = "Hello, world!";
  const invalidBody = "invalid";
  const alg = "ES256";
  const { jwk, pkcs8 } = await generateKey(alg);
  const jws = await signBody(body, pkcs8);
  const keys = LocalKeys({ keys: [jwk] });
  const result = await verifyBody(invalidBody, jws, keys);
  expect(result).instanceOf(Error);
  expect(result).not.haveOwnProperty("payload");
});
