import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { OrganizationMetadata } from "./organization-metadata";

export const OriginatorProfile = {
  title: "Originator Profile",
  allOf: [
    OrganizationMetadata,
    {
      type: "object",
      additionalProperties: true,
      properties: {
        vct: {
          type: "string",
          format: "uri",
        },
        "vct#integrity": {
          type: "string",
        },
        iss: {
          title: "JWT Issuer",
          description:
            "[RFC 7519 Section 4.1.1](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1)",
          type: "string",
          format: "uri",
        },
        "iss#integrity": {
          type: "string",
        },
        sub: {
          title: "JWT Subject",
          description:
            "[RFC 7519 Section 4.1.2](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2)",
          type: "string",
          format: "hostname",
        },
        exp: {
          title: "JWT Expiration Time",
          description:
            "[RFC 7519 Section 4.1.4](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4)",
          type: "number",
        },
        iat: {
          title: "JWT Issued At",
          description:
            "[RFC 7519 Section 4.1.6](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6)",
          type: "number",
        },
      },
      required: [
        "vct",
        "vct#integrity",
        "iss",
        "iss#integrity",
        "sub",
        "iat",
        "exp",
      ],
    },
  ],
} as const satisfies JSONSchema;

export type OriginatorProfile = FromSchema<typeof OriginatorProfile>;
