import { OpVc } from "../op-vc";
import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { AllowedUrl } from "../allowed-url";
import { Target } from "../target";
import { AllowedOrigin } from "../allowed-origin";

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
  },
  required: ["id", "type"],
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
          items: Target,
          minItems: 1,
        },
      },
      required: ["@context", "type", "credentialSubject", "target"],
    },
  ],
} as const satisfies JSONSchema;

export type ContentAttestation = FromSchema<typeof ContentAttestation>;
