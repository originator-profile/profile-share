import { FromSchema, JSONSchema } from "json-schema-to-ts";

export const AllowedOrigin = {
  title: "Allowed Origin",
  type: "array",
  items: {
    type: "string",
    format: "uri",
  },
  description:
    "Content Attestation によって表明される情報の対象となる [origin](https://www.rfc-editor.org/rfc/rfc6454#section-7)",
} as const satisfies JSONSchema;

export type AllowedOrigin = FromSchema<typeof AllowedOrigin>;
