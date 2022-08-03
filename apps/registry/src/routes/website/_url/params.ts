import { FromSchema } from "json-schema-to-ts";

const Params = {
  type: "object",
  properties: {
    url: { type: "string" },
  },
  required: ["url"],
} as const;

type Params = FromSchema<typeof Params>;

export default Params;
