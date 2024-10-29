import { expect, test } from "vitest";
import { createIntegrityMetadata } from "websri";
import { verifyDigestSri } from "./digest-sri";
import { DigestSriContent } from "./types";

async function fetcher(): Promise<Response> {
  return new Response("Hello, World!");
}

const integrityMetadata = await createIntegrityMetadata(
  "sha256",
  await new Response("Hello, World!").arrayBuffer(),
);

const content: DigestSriContent = {
  id: "https://example.org/foo/bar",
  digestSRI: integrityMetadata.toString(),
};

test("Verify Digest SRI successfully", async () => {
  expect(await verifyDigestSri(content, fetcher)).toBe(true);
});

test("Digest SRI mismatch", async () => {
  const mismatch = await createIntegrityMetadata(
    "sha256",
    await new Response("mismatch").arrayBuffer(),
  );

  const mismatchDigestSriContent: DigestSriContent = {
    ...content,
    digestSRI: mismatch.toString(),
  };

  expect(await verifyDigestSri(mismatchDigestSriContent, fetcher)).toBe(false);
});

test("Unsupported algorithm", async () => {
  const unsupportedAlgContent: DigestSriContent = {
    id: "https://example.org/foo/bar",
    digestSRI: "md5-ZajifYh5KDgxtmS9i38K1A==",
  };

  expect(await verifyDigestSri(unsupportedAlgContent, fetcher)).toBe(false);
});

test("Fetch failure", async () => {
  async function failure(): Promise<Response> {
    throw new TypeError("failure");
  }

  await expect(verifyDigestSri(content, failure)).rejects.toThrowError();
});
