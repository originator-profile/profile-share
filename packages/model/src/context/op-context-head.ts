import { FromSchema, JSONSchema } from "json-schema-to-ts";

export const OpContextHead = {
  type: "array",
  additionalItems: true,
  minItems: 2,
  items: [
    {
      const: "https://www.w3.org/ns/credentials/v2",
    },
    {
      const: "https://originator-profile.org/ns/credentials/v1",
    },
  ],
} as const satisfies JSONSchema;

export type OpContextHead = FromSchema<typeof OpContextHead>;
