import type { FromSchema, JSONSchema } from "json-schema-to-ts";

export const Image = {
  title: "画像",
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uri",
    },
    digestSRI: {
      type: "string",
      title: "Integrity Metadata",
      description: "Subresource Integrity (SRI) digest",
    },
  },
  required: ["id"],
} as const satisfies JSONSchema;

export type Image = FromSchema<typeof Image>;
