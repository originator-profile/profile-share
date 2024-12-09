import { FromSchema, JSONSchema } from "json-schema-to-ts";

const Item = {
  type: "string",
  format: "uri",
} as const;

export const AllowedUrl = {
  title: "Allowed URLs",
  anyOf: [
    Item,
    {
      type: "array",
      items: Item,
      minItems: 1,
    },
  ],
  description:
    "Content Attestation によって表明される情報の対象となる URL です。 文字列は必ず URL Pattern string でなければなりません (MUST)。空配列にしてはなりません (MUST NOT)。",
} as const satisfies JSONSchema;

export type AllowedUrl = FromSchema<typeof AllowedUrl>;
