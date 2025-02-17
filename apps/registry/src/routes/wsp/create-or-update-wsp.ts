import { WebsiteProfile } from "@originator-profile/model";
import type { FastifyRequest, FastifySchema } from "fastify";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";
import description from "./create-or-update-wsp.doc.md?raw";

export const method = "POST";
export const url = "";

const body = {
  title: "Website Profile Request",
  type: "object",
  additionalProperties: true,
  allOf: [
    WebsiteProfile,
    {
      type: "object",
      additionalProperties: true,
      properties: {
        issuedAt: {
          type: "string",
          format: "date-time",
          title: "発行日時 (ISO 8601)",
        },
        expiredAt: {
          type: "string",
          format: "date-time",
          title: "期限切れ日時 (ISO 8601)",
        },
      },
    },
  ],
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
      type: ["VerifiableCredential", "WebsiteProfile"],
      issuer: "<OP ID>",
      credentialSubject: {
        id: "<Web サイトのオリジン (形式: https://<ホスト名>)>",
        url: "<Web サイトのオリジン (形式: https://<ホスト名>)>",
        type: "WebSite",
        name: "<Web サイトのタイトル>",
        description: "<Web サイトの説明>",
        image: {
          id: "<サムネイル画像URL>",
        },
      },
      issuedAt: "<発行日時 (例: 2006-01-02T15:04:05Z)>",
      expiredAt: "<期限切れ日時 (例: 2006-01-02T15:04:05Z)>",
    },
  ],
} as const satisfies JSONSchema;

type Body = FromSchema<typeof body>;

export const schema = {
  operationId: "createOrUpdateWsp",
  tags: ["sp"],
  description,
  body,
  response: {
    200: {
      type: "string",
    },
  },
} as const satisfies FastifySchema;

export async function handler(
  req: FastifyRequest<{ Body: Body }>,
): Promise<string> {
  const wsp = await req.server.services.publisher.createOrUpdateWsp(
    req.accountId as string,
    req.body,
  );

  return wsp;
}
