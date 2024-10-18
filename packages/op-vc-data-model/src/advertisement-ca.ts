import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { AllowedOrigin } from "./allowed-origin";
import { AllowedUrl } from "./allowed-url";
import Category from "./category";
import { TargetIntegrity } from "./target-integrity";
import { ContentAttestation } from "./content-attestation";

const subject = {
  type: "object",
  additionalProperties: true,
  properties: {
    id: {
      type: "string",
      format: "uri",
      description: "CA ID",
    },
    type: {
      type: "string",
      const: "AdvertisementProperties",
    },
    title: {
      type: "string",
      description: "広告のタイトル。",
    },
    description: {
      type: "string",
      description: "広告の説明（プレーンテキスト）。",
    },
    image: {
      type: "object",
      title: "画像",
      properties: {
        id: { type: "string", format: "uri" },
        digestSRI: {
          type: "string",
          title: "Integrity Metadata",
          description: "Subresource Integrity (SRI) digest",
        },
      },
      required: ["id", "digestSRI"],
    },
    category: {
      // TODO 単一値を許す
      type: "array",
      items: Category,
      description:
        "IAB カテゴリータクソノミーによる分類の JSON 配列。空配列でもよい (MAY)。",
    },
  },
  required: ["id", "title", "description"],
} as const satisfies JSONSchema;

const AdvertisementCA = {
  type: "object",
  additionalProperties: true,
  allOf: [
    ContentAttestation,
    {
      type: "object",
      additionalProperties: true,
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
        target: {
          type: "array",
          items: TargetIntegrity,
          minItems: 1,
        },
        credentialSubject: subject,
      },
      required: ["@context", "type", "credentialSubject", "target"],
    },
    {
      oneOf: [
        {
          type: "object",
          additionalProperties: true,
          properties: {
            allowedUrl: AllowedUrl,
            allowedOrigin: {
              enum: [],
            },
          },
          required: ["allowedUrl"],
        },
        {
          type: "object",
          additionalProperties: true,
          properties: {
            allowedUrl: {
              enum: [],
            },
            allowedOrigin: AllowedOrigin,
          },
          required: ["allowedOrigin"],
        },
      ],
    },
  ],
} as const satisfies JSONSchema;

export type AdvertisementCA = FromSchema<typeof AdvertisementCA>;
