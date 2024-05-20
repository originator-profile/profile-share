import { FromSchema } from "json-schema-to-ts";

const Params = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
      title: "ウェブサイトID",
      description: "操作対象のWebページの website ID を与えてください。",
    },
  },
  additionalProperties: false,
  required: ["id"],
} as const;

type Params = FromSchema<typeof Params>;

export default Params;
