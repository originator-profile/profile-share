import { FromSchema } from "json-schema-to-ts";

export const AllowedOrigins = {
  title: "Allowed Origins",
  type: "array",
  items: {
    type: "string",
    format: "uri",
  },
  description:
    "Web Assertion によって表明される情報の対象となる [origin](https://www.rfc-editor.org/rfc/rfc6454#section-7)",
} as const;

export type AllowedOrigins = FromSchema<typeof AllowedOrigins>;
