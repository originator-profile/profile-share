import { FromSchema } from "json-schema-to-ts";

const OpCredential = {
  $id: "op-credential",
  title: "Originator Profile Credential",
  description: "認証機構の報告書などの資格情報",
  type: "object",
  properties: {
    type: { const: "credential" },
  },
  required: ["type"],
} as const;

type OpCredential = FromSchema<typeof OpCredential>;

export default OpCredential;
