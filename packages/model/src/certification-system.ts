import { JSONSchema, FromSchema } from "json-schema-to-ts";

const CertificationSystem = {
  title: "Certification System",
  description: "認証制度",
  type: "object",
  properties: {
    type: { const: "certification-system" },
    name: {
      title: "認証制度名",
      type: "string",
    },
    description: {
      title: "認証制度の説明",
      type: "string",
    },
    url: {
      title: "認証制度の詳細URL",
      type: "string",
    },
    urlTitle: {
      title: "認証制度の詳細タイトル",
      type: "string",
    },
    certifier: {
      title: "認証機関",
      type: "object",
      properties: {
        id: {
          title: "認証機関UUID",
          type: "string",
        },
        name: {
          title: "認証機関名称",
          type: "string",
        },
      },
      required: ["id", "name"],
    },
    verifier: {
      title: "検証機関",
      type: "object",
      properties: {
        id: {
          title: "検証機関UUID",
          type: "string",
        },
        name: {
          title: "検証機関名称",
          type: "string",
        },
      },
      required: ["id", "name"],
    },
  },
  required: ["type", "name", "description", "url", "urlTitle"],
  additionalProperties: false,
} as const satisfies JSONSchema;

type CertificationSystem = FromSchema<typeof CertificationSystem>;

export default CertificationSystem;
