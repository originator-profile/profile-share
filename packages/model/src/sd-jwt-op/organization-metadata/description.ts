import { FromSchema, JSONSchema } from "json-schema-to-ts";

export const Description = {
  title: "Description",
  type: "object",
  additionalProperties: true,
  properties: {
    type: {
      title: "説明のフォーマット",
      type: "string",
      enum: ["text/plain"],
    },
    data: {
      title: "説明",
      type: "string",
      maxLength: 10000,
    },
  },
} as const satisfies JSONSchema;

export type Description = FromSchema<typeof Description>;
