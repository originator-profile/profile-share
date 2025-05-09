import { Certificate } from "@originator-profile/model";
import type { FastifyRequest, FastifySchema } from "fastify";
import type { FromSchema } from "json-schema-to-ts";
import description from "./create-or-update-pa.doc.md?raw";

export const method = "POST";
export const url = "";

// Certificateスキーマを使用
const body = Object.assign({}, Certificate, {
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
      type: ["VerifiableCredential", "Certificate"],
      issuer: "dns:pa-issuer.example.org",
      credentialSubject: {
        id: "dns:pa-holder.example.jp",
        type: "CertificateProperties",
        addressCountry: "JP",
        name: "○○新聞社 (※開発用サンプル)",
        corporateNumber: "0000000000000",
        postalCode: "000-0000",
        addressRegion: "東京都",
        addressLocality: "千代田区",
        streetAddress: "○○○",
        certificationSystem: {
          id: "urn:uuid:5374a35f-57ce-43fd-84c3-2c9b0163e3df",
          type: "CertificationSystem",
          name: "法人番号システムWeb-API",
          ref: "https://www.houjin-bangou.nta.go.jp/",
        },
      },
    },
  ],
});

type Body = FromSchema<typeof body>;

export const schema = {
  operationId: "createOrUpdatePa",
  tags: ["pa"],
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
  return await req.server.services.certificate.createOrUpdatePa(
    req.accountId as string,
    req.body as Certificate,
  );
}
