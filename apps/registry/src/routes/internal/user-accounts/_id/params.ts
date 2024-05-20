import { FromSchema } from "json-schema-to-ts";

const Params = {
  type: "object",
  properties: {
    id: {
      type: "string",
      title: "ユーザーアカウントID",
      description: "操作対象のユーザーアカウントの ID を与えてください。",
    },
  },
  additionalProperties: false,
  required: ["id"],
} as const;

type Params = FromSchema<typeof Params>;

export default Params;
