import { WebsiteProfile } from "@originator-profile/model";
import type { FastifyRequest, FastifySchema } from "fastify";
import type { FromSchema } from "json-schema-to-ts";
import description from "./create-or-update-wsp.doc.md?raw";

export const method = "POST";
export const url = "";

const body = Object.assign(WebsiteProfile, {
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
        id: "<Web サイトの URL>",
        url: "<Web サイトの URL>",
        type: "WebSite",
        name: "<Web サイトのタイトル>",
        description: "<Web サイトの説明>",
        image: {
          id: "<サムネイル画像URL>",
        },
      },
      issuedAt: "<発行日時 (optional)>",
      expiredAt: "<期限切れ日時 (optional)>",
    },
  ],
});

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
