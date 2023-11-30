import { FromSchema } from "json-schema-to-ts";

const Advertisement = {
  title: "Advertisement",
  description: "Advertisement",
  type: "object",
  properties: {
    type: { const: "advertisement" },
    url: {
      title: "Published URL",
      type: "string",
      description: "掲載先 URL",
    },
    title: { title: "Title", type: "string" },
    description: { title: "Description", type: "string" },
  },
  required: ["type"],
} as const;

type Advertisement = FromSchema<typeof Advertisement>;

export default Advertisement;
