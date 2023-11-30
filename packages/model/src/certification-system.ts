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
      title: "認証制度に関するウェブサイトURL",
      type: "string",
    },
    urlTitle: {
      title: "認証制度に関するウェブサイト表示名",
      type: "string",
    },
  },
  required: ["type", "name", "description", "url", "urlTitle"],
  additionalProperties: false,
} as const satisfies JSONSchema;

type CertificationSystem = FromSchema<typeof CertificationSystem>;

export default CertificationSystem;
