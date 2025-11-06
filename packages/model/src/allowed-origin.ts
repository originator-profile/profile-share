import { FromSchema, JSONSchema } from "json-schema-to-ts";

const Item = {
  type: "string",
  format: "uri",
} as const;

export const AllowedOrigin = {
  title: "Allowed Origin",
  anyOf: [
    Item,
    {
      type: "array",
      items: Item,
    },
  ],
  description:
    "@deprecated Content Attestation では allowedOrigin は非推奨です。代わりに allowedUrl を使用してください。2026年9月までサポートされます。\n\n" +
    "表明される情報の対象となる [origin](https://www.rfc-editor.org/rfc/rfc6454#section-7)",
} as const satisfies JSONSchema;

export type AllowedOrigin = FromSchema<typeof AllowedOrigin>;
