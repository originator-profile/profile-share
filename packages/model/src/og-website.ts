import { FromSchema } from "json-schema-to-ts";

const OgWebsite = {
  title: "Website",
  description: "Website",
  type: "object",
  properties: {
    type: { const: "website" },
    url: { title: "URL", type: "string" },
    title: { title: "Title", type: "string" },
    image: { title: "Image URL", type: "string" },
    description: { title: "Description", type: "string" },
    "https://schema.org/author": { title: "Author", type: "string" },
    "https://schema.org/category": { title: "Category", type: "string" },
    "https://schema.org/editor": { title: "Editor", type: "string" },
  },
  required: ["type"],
} as const;

type OgWebsite = FromSchema<typeof OgWebsite>;

export default OgWebsite;
