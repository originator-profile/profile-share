import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { Image } from "../image";
import { CertificationSystem } from "./cert-system";

export const CertificateProperties = {
  type: "object",
  additionalProperties: false,
  properties: {
    id: { type: "string", title: "subject の OP ID", format: "uri" },
    type: { type: "string", const: "CertificateProperties" },
    description: { type: "string", title: "説明" },
    image: Image,
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
