import { FromSchema } from "json-schema-to-ts";

/** @deprecated */
const Advertisement = {
  deprecated: true,
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
    image: {
      title: "Image URL",
      type: "string",
      description: "広告のサムネイル表示用 URL",
    },
  },
  required: ["type"],
} as const;

/** @deprecated */
type Advertisement = FromSchema<typeof Advertisement>;

export default Advertisement;
