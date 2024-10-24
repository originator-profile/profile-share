import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { CertificationSystem } from "./cert-system";

export const CertificateProperties = {
  type: "object",
  additionalProperties: false,
  properties: {
    id: { type: "string", title: "subject の OP ID", format: "uri" },
    type: { type: "string", const: "CertificateProperties" },
    description: { type: "string", title: "説明" },
    image: {
      type: "object",
      title: "画像",
      properties: {
        id: { type: "string", format: "uri" },
        digestSRI: {
          type: "string",
          title: "Integrity Metadata",
          description: "Subresource Integrity (SRI) digest",
        },
      },
      required: ["id", "digestSRI"],
    },
    certifier: {
      type: "string",
      title: "認証機関名",
    },
    verifier: {
      type: "string",
      title: "検証機関名",
    },
    certificationSystem: CertificationSystem,
  },
  required: ["id", "type", "certificationSystem", "description"],
} as const satisfies JSONSchema;

export type CertificateProperties = FromSchema<typeof CertificateProperties>;
