import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { CertificationSystem } from "./certification-system";

export const JapaneseExistenceCertificateProperties = {
  $schema: "https://json-schema.org/draft/2019-09/schema",
  type: "object",
  additionalProperties: false,
  properties: {
    id: { type: "string", title: "subject の OP ID", format: "uri" },
    type: { type: "string", const: "ECJPProperties" },
    name: {
      title: "法人名",
      type: "string",
    },
    description: { type: "string", title: "説明" },
    corporateNumber: {
      title: "法人番号",
      type: "string",
    },
    postalCode: {
      title: "郵便番号",
      type: "string",
    },
    addressCountry: {
      title: "国",
      type: "string",
    },
    addressRegion: {
      title: "都道府県",
      type: "string",
    },
    addressLocality: {
      title: "市区町村",
      type: "string",
    },
    streetAddress: {
      title: "番地・ビル名",
      type: "string",
    },
    certificationSystem: CertificationSystem,
  },
  required: [
    "id",
    "type",
    "name",
    "corporateNumber",
    "postalCode",
    "addressCountry",
    "addressRegion",
    "addressLocality",
    "streetAddress",
    "certificationSystem",
  ],
} as const satisfies JSONSchema;

export const JapaneseExistenceCertificate = {
  $schema: "https://json-schema.org/draft/2019-09/schema",
  type: "object",
  additionalProperties: false,
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
    credentialSubject: JapaneseExistenceCertificateProperties,
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
  },
  required: ["@context", "type", "issuer", "credentialSubject"],
} as const satisfies JSONSchema;

export type JapaneseExistenceCertificate = FromSchema<
  typeof JapaneseExistenceCertificate
>;
