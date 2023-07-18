import { test, expect } from "vitest";
import { importJWK, flattenedVerify, decodeProtectedHeader } from "jose";
import { generateJwk, generateKey } from "./generate-key";
import { signBody } from "./sign-body";

test("signBody() returns an object containing verifiable compact JWS", async () => {
  const body = "Hello, world!";
  const alg = "ES256";
  const { publicKey, privateKey } = await generateJwk(alg);
  const jws = await signBody(body, privateKey);
  expect(decodeProtectedHeader(jws).kid).toBe(publicKey.kid);
  const [protectedHeader, emptyPayload, signature] = jws.split(".");
  expect(emptyPayload).toBe("");
  const payload = new TextEncoder().encode(body);
  const publicKeyImported = await importJWK(publicKey, alg);
  const verification = await flattenedVerify(
    {
      protected: protectedHeader,
      payload,
      signature,
    },
    publicKeyImported,
  );
  expect(verification.payload).toEqual(payload);
});
