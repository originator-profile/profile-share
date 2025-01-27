import {
  ContentAttestationSet,
  UnsignedContentAttestation,
} from "@originator-profile/model";
import type { FastifyRequest, FastifySchema } from "fastify";
import type { FromSchema } from "json-schema-to-ts";
import description from "./create-or-update-ca.doc.md?raw";

export const method = "POST";
export const url = "";

const body = Object.assign(UnsignedContentAttestation, {
  examples: [
    {
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://originator-profile.org/ns/credentials/v1",
        "https://originator-profile.org/ns/cip/v1",
        {
          "@language": "<言語・地域コード>",
        },
      ],
      type: ["VerifiableCredential", "ContentAttestation"],
      issuer: "<OP ID>",
      credentialSubject: {
        id: "<CA ID (登録時省略可・更新時必須)>",
        type: "Article",
        headline: "<コンテンツのタイトル>",
        description: "<コンテンツの説明>",
        image: {
          id: "<サムネイル画像URL>",
        },
        datePublished: "<公開日時>",
        dateModified: "<最終更新日時>",
        author: ["<著者名>"],
        editor: ["<編集者名>"],
        genre: "<ジャンル>",
      },
      allowedUrl: "<CAの使用を許可するWebページのURL Pattern>",
      target: [
        {
          type: "<Target Integrityの種別>",
          content: "<コンテンツ本体 (text/html or URL)>",
          cssSelector: "<CSS セレクター (optional)>",
        },
      ],
      issuedAt: "<発行日時 (optional)>",
      expiredAt: "<期限切れ日時 (optional)>",
    },
  ],
});

type Body = FromSchema<typeof body>;

export const schema = {
  operationId: "createOrUpdateCa",
  tags: ["ca"],
  description,
  body,
  response: {
    200: ContentAttestationSet,
  },
} as const satisfies FastifySchema;

export async function preValidation(
  req: FastifyRequest<{ Body: Body }>,
): Promise<void> {
  req.body.credentialSubject.id ??= `urn:uuid:${crypto.randomUUID()}`;
}

export async function handler(
  req: FastifyRequest<{ Body: Body }>,
): Promise<ContentAttestationSet> {
  const cas = await req.server.services.publisher.createOrUpdate(
    req.accountId as string,
    req.body,
  );

  return cas;
}
