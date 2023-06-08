import { FromSchema } from "json-schema-to-ts";
import Category from "./category";

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
    category: {
      title: Category.title,
      type: "array",
      items: Category,
    },
    "https://schema.org/editor": { title: "Editor", type: "string" },
    "https://schema.org/datePublished": {
      title: "DatePublished",
      type: "string",
      format: "date-time",
    },
    "https://schema.org/dateModified": {
      title: "DateModified",
      type: "string",
      format: "date-time",
    },
  },
  required: ["type"],
} as const;

type OgWebsite = FromSchema<typeof OgWebsite>;

export default OgWebsite;
