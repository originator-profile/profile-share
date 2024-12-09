import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { AllowedOrigin } from "../allowed-origin";
import { AllowedUrl } from "../allowed-url";
import { OpContextHead } from "../context/op-context-head";
import { OpVc } from "../op-vc";
import { RawTarget } from "../target/raw-target";

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

export const UnsignedContentAttestation = {
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
          contains: {
            const: "ContentAttestation",
          },
        },
        credentialSubject: subject,
        allowedUrl: AllowedUrl,
        allowedOrigin: AllowedOrigin,
        target: {
          type: "array",
          items: RawTarget,
          minItems: 1,
        },
      },
      required: ["@context", "type", "credentialSubject", "target"],
    },
  ],
} as const satisfies JSONSchema;

export type UnsignedContentAttestation = FromSchema<
  typeof UnsignedContentAttestation
>;
