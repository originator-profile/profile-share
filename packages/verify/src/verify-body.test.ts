import { test, expect } from "vitest";
import { signBody } from "@originator-profile/sign";
import { verifyBody } from "./verify-body";
import { generateKey, LocalKeys } from "@originator-profile/cryptography";

test("verify body", async () => {
  const body = "Hello, world!";
  const alg = "ES256";
  const { publicKey, privateKey } = await generateKey(alg);
  const jws = await signBody(body, privateKey);
  const keys = LocalKeys({ keys: [publicKey] });
  const result = await verifyBody(body, jws, keys);
  expect(result).not.instanceOf(Error);
  // @ts-expect-error assert
  expect(result.payload).toEqual(new TextEncoder().encode(body));
});

test("invalid body", async () => {
  const body = "Hello, world!";
  const invalidBody = "invalid";
  const alg = "ES256";
  const { publicKey, privateKey } = await generateKey(alg);
  const jws = await signBody(body, privateKey);
  const keys = LocalKeys({ keys: [publicKey] });
  const result = await verifyBody(invalidBody, jws, keys);
  expect(result).instanceOf(Error);
  expect(result).not.haveOwnProperty("payload");
});
