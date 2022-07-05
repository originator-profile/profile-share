import { FromSchema } from "json-schema-to-ts";

const Params = {
  type: "object",
  properties: {
    certifier_id: { type: "string" },
    holder_id: { type: "string" },
  },
  required: ["certifier_id", "holder_id"],
} as const;

type Params = FromSchema<typeof Params>;

export default Params;
