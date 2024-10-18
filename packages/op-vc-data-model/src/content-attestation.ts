import { OpVc } from "@originator-profile/abstract-model";
import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { AllowedUrl } from "./allowed-url";
import { TargetIntegrity } from "./target-integrity";
import { AllowedOrigin } from "./allowed-origin";

const subject = {
  type: "object",
  additionalProperties: true,
  properties: {
    id: {
      title: "CA ID",
      type: "string",
      format: "uri",
    },
    type: {
      title: "JSON-LD タイプ",
      type: "string",
    },
    title: {
      title: "タイトル",
      type: "string",
      description: "コンテンツのタイトル。",
    },
    description: {
      title: "説明",
      type: "string",
      description: "コンテンツの説明（プレーンテキスト）。",
    },
  },
  required: ["id", "type", "title", "description"],
} as const satisfies JSONSchema;

export const ContentAttestation = {
  type: "object",
  additionalProperties: true,
  allOf: [
    OpVc,
    {
      type: "object",
      additionalProperties: true,
      properties: {
        "@context": {
          type: "array",
          additionalItems: true,
          minItems: 2,
          items: [
            {
              type: "string",
              const: "https://www.w3.org/ns/credentials/v2",
            },
            {
              type: "string",
              const: "https://originator-profile.org/ns/credentials/v1",
            },
          ],
        },
        type: {
          type: "array",
          additionalItems: { const: "ContentAttestation" },
          minItems: 2,
        },
        credentialSubject: subject,
        allowedUrl: AllowedUrl,
        allowedOrigin: AllowedOrigin,
        target: {
          type: "array",
          items: TargetIntegrity,
          minItems: 1,
        },
      },
      required: ["@context", "type", "credentialSubject", "target"],
    },
  ],
} as const satisfies JSONSchema;

export type ContentAttestation = FromSchema<typeof ContentAttestation>;
