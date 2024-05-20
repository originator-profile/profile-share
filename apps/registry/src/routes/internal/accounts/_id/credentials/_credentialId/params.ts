import { FromSchema } from "json-schema-to-ts";
import AccountParams from "../../params";

const Params = {
  type: "object",
  properties: {
    ...AccountParams.properties,
    credentialId: {
      type: "number",
      title: "資格情報ID",
      description: "資格情報の ID を与えてください。",
    },
  },
  additionalProperties: false,
  required: ["id", "credentialId"],
} as const;

type Params = FromSchema<typeof Params>;

export default Params;
