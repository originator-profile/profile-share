import { FromSchema } from "json-schema-to-ts";

const Params = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
} as const;

type Params = FromSchema<typeof Params>;

export default Params;
