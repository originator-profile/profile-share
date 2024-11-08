import { FromSchema, JSONSchema } from "json-schema-to-ts";

export const BusinessCategory = {
  title: "Business Category",
  type: "array",
  items: {
    title: "事業種目",
    type: "string",
  },
} as const satisfies JSONSchema;

export type BusinessCategory = FromSchema<typeof BusinessCategory>;
