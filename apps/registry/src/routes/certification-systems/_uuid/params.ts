import type { FromSchema } from "json-schema-to-ts";

const Params = {
  type: "object",
  properties: {
    uuid: {
      title: "Certification System ID",
      type: "string",
    },
  },
  required: ["uuid"],
} as const;

type Params = FromSchema<typeof Params>;

export default Params;
