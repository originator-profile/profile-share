import { WebMediaProfile } from "@originator-profile/model";
import type { FastifyRequest, FastifySchema } from "fastify";
import type { FromSchema } from "json-schema-to-ts";
import description from "./create-or-update-wmp.doc.md?raw";

export const method = "POST";
export const url = "";

const body = Object.assign(WebMediaProfile, {
  examples: [
    {
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://originator-profile.org/ns/credentials/v1",
        "https://originator-profile.org/ns/cip/v1",
        {
          "@language": "ja",
        },
      ],
      type: ["VerifiableCredential", "WebMediaProfile"],
      issuer: "dns:wmp-issuer.example.org",
      credentialSubject: {
        id: "dns:wmp-holder.example.jp",
        type: "OnlineBusiness",
        url: "https://www.wmp-holder.example.jp/",
        name: "○○メディア (※開発用サンプル)",
        logo: {
          id: "https://www.wmp-holder.example.jp/image.png",
          digestSRI: "sha256-Upwn7gYMuRmJlD1ZivHk876vXHzokXrwXj50VgfnMnY=",
        },
        email: "contact@wmp-holder.example.jp",
        telephone: "0000000000",
        contactPoint: {
          name: "お問い合わせ",
          id: "https://wmp-holder.example.jp/contact",
        },
        privacyPolicy: {
          name: "プライバシーポリシー",
          id: "https://wmp-holder.example.jp/privacy",
        },
        informationTransmissionPolicy: {
          name: "情報発信ポリシー",
          id: "https://wmp-holder.example.jp/statement",
        },
        description: {
          type: "PlainTextDescription",
          data: "この文章はこの Web メディアに関する補足情報です。",
        },
      },
    },
  ],
});

type Body = FromSchema<typeof body>;

export const schema = {
  operationId: "createOrUpdateWmp",
  tags: ["wmp"],
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
  return await req.server.services.certificate.createOrUpdateWmp(
    req.accountId as string,
    req.body as WebMediaProfile,
  );
}
