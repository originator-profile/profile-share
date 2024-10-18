import { FromSchema, JSONSchema } from "json-schema-to-ts";

const BusinessCategory = {
  title: "Business Category",
  type: "array",
  items: {
    title: "事業種目",
    type: "string",
  },
} as const satisfies JSONSchema;

type BusinessCategory = FromSchema<typeof BusinessCategory>;

export default BusinessCategory;
