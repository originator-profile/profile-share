import type { FromSchema } from "json-schema-to-ts";

const Params = {
  type: "object",
  properties: {
    id: {
      type: "string",
      title: "DP ID",
      format: "uuid",
      description:
        "Signed Advertisement Profile (SAP) の ID を指定してください。",
    },
  },
  additionalProperties: false,
  required: ["id"],
} as const;

type Params = FromSchema<typeof Params>;

export default Params;
