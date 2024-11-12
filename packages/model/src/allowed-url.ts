import { FromSchema, JSONSchema } from "json-schema-to-ts";

const Item = {
  type: "string",
  format: "uri",
} as const;

export const AllowedUrl = {
  title: "Allowed URLs",
  oneOf: [
    Item,
    {
      type: "array",
      items: Item,
    },
  ],
  description:
    "Content Attestation によって表明される情報の対象となる URL です。 文字列は必ず URL Pattern string でなければなりません (MUST)。",
} as const satisfies JSONSchema;

export type AllowedUrl = FromSchema<typeof AllowedUrl>;
