import { FromSchema } from "json-schema-to-ts";

const BusinessCategory = {
  $id: "business-category",
  title: "Business Category",
  type: "array",
  items: {
    title: "事業種目",
    type: "string",
  },
} as const;

type BusinessCategory = FromSchema<typeof BusinessCategory>;

export default BusinessCategory;
