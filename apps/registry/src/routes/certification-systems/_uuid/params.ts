import type { FromSchema } from "json-schema-to-ts";

const Params = {
  type: "object",
  properties: {
    uuid: {
      type: "string",
      format: "uuid",
      title: "Certification System ID",
      description: "認証制度の ID を指定してください。",
    },
  },
  additionalProperties: false,
  required: ["uuid"],
} as const;

type Params = FromSchema<typeof Params>;

export default Params;
