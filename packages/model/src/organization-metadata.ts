import { FromSchema, JSONSchema } from "json-schema-to-ts";
import Jwks from "./jwks";
import { Organization } from "./organization-metadata/organization";

export const OrganizationMetadata = {
  title: "Organization Metadata",
  type: "object",
  additionalProperties: true,
  properties: {
    locale: {
      title: "ロケール",
      description: "Unicode CLDR locale identifier",
      type: "string",
    },
    jwks: {
      ...Jwks,
      title: "発行者の公開鍵の JSON Web Key Set",
    },
    issuer: Organization,
    holder: Organization,
  },
  required: ["locale", "jwks", "issuer", "holder"],
} as const satisfies JSONSchema;

export type OrganizationMetadata = FromSchema<typeof OrganizationMetadata>;
