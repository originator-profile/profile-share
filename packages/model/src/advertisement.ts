import { FromSchema } from "json-schema-to-ts";

const Advertisement = {
  title: "Advertisement",
  description: "Advertisement",
  type: "object",
  properties: {
    type: { const: "advertisement" },
    url: {
      title: "Advertisement HTML Delivery URL",
      type: "string",
      description: "広告 HTML 配信元 URL",
    },
    title: { title: "Title", type: "string" },
    description: { title: "Description", type: "string" },
  },
  required: ["type"],
} as const;

type Advertisement = FromSchema<typeof Advertisement>;

export default Advertisement;
