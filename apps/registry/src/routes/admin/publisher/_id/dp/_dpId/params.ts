import { FromSchema } from "json-schema-to-ts";

const Params = {
  type: "object",
  properties: {
    id: { type: "string", description: "アカウントID" },
    dpId: { type: "string", description: "DP ID" },
  },
  required: ["id", "dpId"],
} as const;

type Params = FromSchema<typeof Params>;

export default Params;
