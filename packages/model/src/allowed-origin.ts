import { FromSchema, JSONSchema } from "json-schema-to-ts";

const Item = {
  type: "string",
  format: "uri",
} as const;

export const AllowedOrigin = {
  title: "Allowed Origin",
  oneOf: [
    Item,
    {
      type: "array",
      items: Item,
    },
  ],
  description:
    "Content Attestation によって表明される情報の対象となる [origin](https://www.rfc-editor.org/rfc/rfc6454#section-7)",
} as const satisfies JSONSchema;

export type AllowedOrigin = FromSchema<typeof AllowedOrigin>;
