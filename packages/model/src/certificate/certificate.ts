import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { OpVc } from "../op-vc";
import { CertificateProperties } from "./certificate-properties";

export const Certificate = {
  $schema: "https://json-schema.org/draft/2019-09/schema",
  type: "object",
  allOf: [
    OpVc,
    {
      type: "object",
      properties: {
        "@context": {
          type: "array",
          additionalItems: false,
          minItems: 4,
          items: [
            {
              type: "string",
              const: "https://www.w3.org/ns/credentials/v2",
            },
            {
              type: "string",
              const: "https://originator-profile.org/ns/credentials/v1",
            },
            {
              type: "string",
              const: "https://originator-profile.org/ns/cip/v1",
            },
            {
              type: "object",
              properties: {
                "@language": {
                  type: "string",
                  title: "言語コード",
                },
              },
            },
          ],
        },
        type: {
          type: "array",
          additionalItems: false,
          minItems: 1,
          items: [{ const: "VerifiableCredential" }, { const: "Certificate" }],
        },
        issuer: { type: "string", format: "uri" },
        validFrom: {
          type: "string",
          format: "date-time",
          title: "有効開始日時",
        },
        validUntil: {
          type: "string",
          format: "date-time",
          title: "有効終了日時",
        },
        credentialSubject: CertificateProperties,
      },
      required: ["@context", "type", "issuer", "credentialSubject"],
    },
  ],
} as const satisfies JSONSchema;

export type Certificate = FromSchema<typeof Certificate>;
