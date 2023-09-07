import { FromSchema } from "json-schema-to-ts";

const Params = {
  type: "object",
  properties: {
    id: { type: "string", title: "アカウントID" },
    credentialId: { type: "string", title: "資格情報ID" },
  },
  additionalProperties: false,
  required: ["id", "credentialId"],
} as const;

type Params = FromSchema<typeof Params>;

export default Params;
