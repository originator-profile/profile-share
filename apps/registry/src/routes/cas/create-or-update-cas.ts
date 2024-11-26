import { ContentAttestationSet } from "@originator-profile/model";
import type { FastifyRequest, FastifySchema } from "fastify";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";
import description from "./create-or-update-cas.doc.md?raw";

export const method = "POST";
export const url = "";

const body = {
  type: "object",
  properties: {},
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
        id: "<CA ID>",
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
          content: "<コンテンツ本体 (text/html or Data URL)>",
          cssSelector: "<CSS セレクター (optional)>",
        },
      ],
      issuedAt: "発行日時 (optional)>",
      expiredAt: "期限切れ日時 (optional)>",
    },
  ],
} as const as JSONSchema;

type Body = FromSchema<typeof body>;

export const schema = {
  operationId: "createOrUpdateCas",
  tags: ["cas"],
  description,
  body,
  response: {
    200: {
      ...ContentAttestationSet,
      description: `TODO: <https://github.com/originator-profile/profile/issues/1604>`,
    },
  },
} as const satisfies FastifySchema;

export async function handler(
  _: FastifyRequest<{ Body: Body }>,
): Promise<ContentAttestationSet> {
  return []; // TODO: https://github.com/originator-profile/profile/issues/1604
}
