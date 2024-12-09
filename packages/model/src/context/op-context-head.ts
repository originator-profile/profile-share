import { FromSchema, JSONSchema } from "json-schema-to-ts";

export const OpContextHead = {
  type: "array",
  allOf: [
    {
      contains: {
        const: "https://www.w3.org/ns/credentials/v2",
      },
    },
    {
      contains: {
        const: "https://originator-profile.org/ns/credentials/v1",
      },
    },
  ],
} as const satisfies JSONSchema;

export type OpContextHead = FromSchema<typeof OpContextHead>;
