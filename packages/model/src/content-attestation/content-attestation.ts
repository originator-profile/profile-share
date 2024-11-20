import { OpVc } from "../op-vc";
import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { AllowedUrl } from "../allowed-url";
import { Target } from "../target";
import { AllowedOrigin } from "../allowed-origin";
import { OpContextHead } from "../context/op-context-head";

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
        "@context": OpContextHead,
        type: {
          type: "array",
          items: [{}],
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
      required: ["@context", "type", "credentialSubject"],
    },
  ],
} as const satisfies JSONSchema;

export type ContentAttestation = FromSchema<typeof ContentAttestation>;
