import { FromSchema } from "json-schema-to-ts";

const OpCredential = {
  title: "Originator Profile Credential",
  description: "認証機関の報告書などの資格情報",
  type: "object",
  properties: {
    type: { const: "credential" },
    certifier: {
      title: "認証機関を表す一義的な識別子",
      type: "string",
    },
    verifier: {
      title: "検証機関を表す一義的な識別子",
      type: "string",
    },
    name: {
      title: "資格名",
      type: "string",
    },
    image: {
      title: "画像URL",
      type: "string",
    },
    issuedAt: {
      title: "発行日時",
      type: "string",
      format: "date-time",
    },
    expiredAt: {
      title: "有効期限",
      type: "string",
      format: "date-time",
    },
  },
  required: ["type", "certifier", "verifier", "name", "issuedAt", "expiredAt"],
  additionalProperties: false,
} as const;

type OpCredential = FromSchema<typeof OpCredential>;

export default OpCredential;
