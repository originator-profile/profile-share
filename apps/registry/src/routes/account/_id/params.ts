import { FromSchema } from "json-schema-to-ts";

const Params = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
      title: "アカウントID",
      description:
        "操作対象のリソースを保有するアカウントの ID を与えてください。",
    },
  },
  additionalProperties: false,
  required: ["id"],
} as const;

type Params = FromSchema<typeof Params>;

export default Params;
