import { FromSchema } from "json-schema-to-ts";
import contentMetadataSchema from "./content-metadata";

const webAssertionSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Web Assertion",
  type: "object",
  additionalProperties: true,
  properties: {
    ...contentMetadataSchema.properties,
    "vct#integrity": {
      type: "string",
    },
    iss: {
      title: "JWT Issuer",
      type: "string",
      format: "uri",
      description: "[RFC7519#section-4.1.1](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1)"
    },
    sub: {
      title: "JWT Subject",
      type: "string",
      format: "hostname",
      description: "[RFC7519#section-4.1.2](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2)"
    },
    iat: {
      title: "JWT Issued At",
      type: "number",
      description: "[RFC7519#section-4.1.6](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6)"
    },
    exp: {
      title: "JWT Expiration Time",
      type: "number",
      description: "[RFC7519#section-4.1.4](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4)"
    }
  },
  required: [
    "vct#integrity",
    "iss",
    "sub",
    "iat",
    "exp",
  ],
} as const;

type WebAssertion = FromSchema<typeof webAssertionSchema>;

export default webAssertionSchema;
export type { WebAssertion };
