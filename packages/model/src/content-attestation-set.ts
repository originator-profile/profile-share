import { FromSchema, JSONSchema } from "json-schema-to-ts";

export const ContentAttestationSetItem = {
  title: "Content Attestation Set Item",
  oneOf: [
    {
      type: "object",
      additionalProperties: true,
      properties: {
        main: {
          type: "boolean",
          const: true,
          title: "メインコンテンツ",
        },
        attestation: {
          title: "Content Attestation",
          type: "string",
        },
      },
      required: ["attestation", "main"],
    },
    {
      type: "string",
      title: "Content Attestation",
    },
  ],
} as const satisfies JSONSchema;

export const ContentAttestationSet = {
  title: "Content Attestation Set",
  type: "array",
  items: ContentAttestationSetItem,
} as const satisfies JSONSchema;

export type ContentAttestationSetItem = FromSchema<
  typeof ContentAttestationSetItem
>;
export type ContentAttestationSet = FromSchema<typeof ContentAttestationSet>;

export default ContentAttestationSet;
