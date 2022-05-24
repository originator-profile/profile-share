import { FromSchema } from "json-schema-to-ts";

const OgWebsite = {
  $id: "og-website",
  title: "Website",
  description: "Website",
  type: "object",
  properties: {
    type: { const: "website" },
    url: { title: "URL", type: "string" },
    title: { title: "Title", type: "string" },
    image: { title: "Image URL", type: "string" },
    description: { title: "Description", type: "string" },
  },
  required: ["type"],
} as const;

type OgWebsite = FromSchema<typeof OgWebsite>;

export default OgWebsite;
