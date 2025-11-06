import { DigestSriContent } from "@originator-profile/sign";
import { expect, test } from "vitest";
import { createIntegrityMetadata } from "websri";
import { verifyDigestSri } from "./digest-sri";

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

test("Multiple hash algorithms - verify with strongest", async () => {
  const sha384Metadata = await createIntegrityMetadata(
    "sha384",
    await new Response("Hello, World!").arrayBuffer(),
  );
  const sha256Metadata = await createIntegrityMetadata(
    "sha256",
    await new Response("Hello, World!").arrayBuffer(),
  );

  const multiAlgContent: DigestSriContent = {
    id: "https://example.org/foo/bar",
    digestSRI: `${sha256Metadata.toString()} ${sha384Metadata.toString()}`,
  };

  expect(await verifyDigestSri(multiAlgContent, fetcher)).toBe(true);
});

test("Multiple hash algorithms - one mismatch", async () => {
  const sha384Metadata = await createIntegrityMetadata(
    "sha384",
    await new Response("Hello, World!").arrayBuffer(),
  );
  const wrongSha256 = await createIntegrityMetadata(
    "sha256",
    await new Response("wrong content").arrayBuffer(),
  );

  const multiAlgContent: DigestSriContent = {
    id: "https://example.org/foo/bar",
    digestSRI: `${wrongSha256.toString()} ${sha384Metadata.toString()}`,
  };

  expect(await verifyDigestSri(multiAlgContent, fetcher)).toBe(true);
});

test("Empty algorithm list", async () => {
  const emptyAlgContent: DigestSriContent = {
    id: "https://example.org/foo/bar",
    digestSRI: "",
  };

  expect(await verifyDigestSri(emptyAlgContent, fetcher)).toBe(false);
});

test("Invalid integrity metadata format", async () => {
  const invalidContent: DigestSriContent = {
    id: "https://example.org/foo/bar",
    digestSRI: "invalid-format-without-dash",
  };

  expect(await verifyDigestSri(invalidContent, fetcher)).toBe(false);
});
