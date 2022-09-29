import { test, expect } from "vitest";
import { importJWK, flattenedVerify, decodeProtectedHeader } from "jose";
import { generateKey } from "./generate-key";
import { signBody } from "./sign-body";

test("signBody() returns an object containing verifiable compact JWS", async () => {
  const body = "Hello, world!";
  const alg = "ES256";
  const { jwk, pkcs8 } = await generateKey(alg);
  const jws = await signBody(body, pkcs8);
  expect(decodeProtectedHeader(jws).kid).toBe(jwk.kid);
  const [protectedHeader, emptyPayload, signature] = jws.split(".");
  expect(emptyPayload).toBe("");
  const payload = new TextEncoder().encode(body);
  const publicKey = await importJWK(jwk, alg);
  const verification = await flattenedVerify(
    {
      protected: protectedHeader,
      payload,
      signature,
    },
    publicKey
  );
  expect(verification.payload).toEqual(payload);
});
