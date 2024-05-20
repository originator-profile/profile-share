import { FromSchema } from "json-schema-to-ts";

const Params = {
  type: "object",
  properties: {
    certifier_id: {
      type: "string",
      format: "uuid",
      title: "認証機関 ID",
      description: "認証機関のアカウント ID を与えてください。",
    },
    holder_id: {
      type: "string",
      format: "uuid",
      title: "保有者 ID",
      description: "SOP 保有者のアカウント ID を与えてください。",
    },
  },
  required: ["certifier_id", "holder_id"],
} as const;

type Params = FromSchema<typeof Params>;

export default Params;
