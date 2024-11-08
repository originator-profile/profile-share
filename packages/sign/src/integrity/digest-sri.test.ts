import { expect, test } from "vitest";
import { createIntegrityMetadata, type HashAlgorithm } from "websri";
import { createDigestSri } from "./digest-sri";
import type { DigestSriContent } from "./types";

async function fetcher(): Promise<Response> {
  return new Response("Hello, World!");
}

const resource = {
  id: "https://example.org/foo/bar",
};

test("Create Digest SRI", async () => {
  const integrityMetadata = await createIntegrityMetadata(
    "sha256",
    await new Response("Hello, World!").arrayBuffer(),
  );

  expect(await createDigestSri("sha256", resource, fetcher)).toEqual({
    id: "https://example.org/foo/bar",
    digestSRI: integrityMetadata.toString(),
  } satisfies DigestSriContent);
});

test("Unsupported algorithm", async () => {
  expect(
    await createDigestSri("md5" as HashAlgorithm, resource, fetcher),
  ).toEqual({ id: "https://example.org/foo/bar" });
});

test("Fetch failure", async () => {
  async function failure(): Promise<Response> {
    throw new TypeError("failure");
  }

  await expect(
    createDigestSri("sha256", resource, failure),
  ).rejects.toThrowError();
});
