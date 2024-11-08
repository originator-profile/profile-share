import { generateKey } from "@originator-profile/cryptography";
import type { ArticleCA, Image, Target } from "@originator-profile/model";
import { addYears, getUnixTime } from "date-fns";
import { decodeJwt } from "jose";
import { expect, test } from "vitest";
import { createIntegrityMetadata } from "websri";
import { signCa } from "./sign-ca";

test("signCa() return a valid JWT with correct claims and integrity metadata", async () => {
  document.body.textContent = "ok";

  const target = {
    type: "TextTargetIntegrity",
    cssSelector: "body",
  } as Target;

  const expectedIntegrityMetadata = await createIntegrityMetadata(
    "sha256",
    await new Response("ok").arrayBuffer(),
  );

  const image: Image = {
    id: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==",
  };

  const digestSri = await createIntegrityMetadata(
    "sha256",
    await new Response(
      `<svg xmlns="http://www.w3.org/2000/svg"></svg>`,
    ).arrayBuffer(),
  );

  const issuedAt = new Date();
  const expiredAt = addYears(new Date(), 10);

  const ca: ArticleCA = {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://originator-profile.org/ns/credentials/v1",
      "https://originator-profile.org/ns/cip/v1",
      {
        "@language": "ja-JP",
      },
    ],
    type: ["VerifiableCredential", "ContentAttestation"],
    issuer: "dns:example.com",
    credentialSubject: {
      id: "urn:uuid:78550fa7-f846-4e0f-ad5c-8d34461cb95b",
      type: "Article",
      headline: "<Webページのタイトル>",
      image,
      description: "<Webページの説明>",
      author: ["山田花子"],
      editor: ["山田太郎"],
      datePublished: "2023-07-04T19:14:00Z",
      dateModified: "2023-07-04T19:14:00Z",
      genre: "スポーツ",
    },
    allowedUrl: ["https://media.example.com/articles/42"],
    target: [target],
  };

  const { privateKey } = await generateKey();
  const jwt = await signCa(ca, privateKey, { issuedAt, expiredAt });
  const valid = decodeJwt(jwt);

  expect((valid.target as [Target])[0]).toEqual({
    type: "TextTargetIntegrity",
    cssSelector: "body",
    integrity: expectedIntegrityMetadata.toString(),
  });

  expect((valid.credentialSubject as { image: Image }).image).toEqual({
    id: ca.credentialSubject.image?.id,
    digestSRI: digestSri.toString(),
  });

  expect(valid).toMatchObject({
    iss: ca.issuer,
    iat: getUnixTime(issuedAt),
    exp: getUnixTime(expiredAt),
    sub: ca.credentialSubject.id,
  });
});
