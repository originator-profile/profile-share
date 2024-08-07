import { FromSchema } from "json-schema-to-ts";
import contentMetadata from "./content-metadata";
import AllowedUrls from "./allowed-urls";
import BaseTargetIntegrity from "./base-target-integrity";
import ExternalResourceTargetIntegrity from "./external-resource-target-integrity";

const webAssertion = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Web Assertion",
  type: "object",
  additionalProperties: true,
  properties: {
    ...contentMetadata.properties,
    "vct#integrity": {
      type: "string",
    },
    iss: {
      title: "JWT Issuer",
      type: "string",
      format: "uri",
      description:
        "[RFC7519#section-4.1.1](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1)",
    },
    sub: {
      title: "JWT Subject",
      type: "string",
      format: "hostname",
      description:
        "[RFC7519#section-4.1.2](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2)",
    },
    iat: {
      title: "JWT Issued At",
      type: "number",
      description:
        "[RFC7519#section-4.1.6](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6)",
    },
    exp: {
      title: "JWT Expiration Time",
      type: "number",
      description:
        "[RFC7519#section-4.1.4](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4)",
    },
    assertion: {
      type: "object",
      additionalProperties: true,
      properties: {
        allowed_urls: { $ref: "#/$defs/allowed_urls" },
        target: {
          type: "array",
          items: {
            $ref: "#/$defs/target_integrity",
          },
          minItems: 1,
          description: "Web Assertion に登録済みのクレーム。",
        },
      },
      required: ["allowed_urls", "target"],
    },
  },
  required: ["vct#integrity", "iss", "sub", "iat", "exp"],
  $defs: {
    allowed_urls: AllowedUrls,
    target_integrity: {
      oneOf: [
        { $ref: "#/$defs/base_target_integrity" },
        { $ref: "#/$defs/external_resource_target_integrity" },
      ],
    },
    base_target_integrity: BaseTargetIntegrity,
    external_resource_target_integrity: ExternalResourceTargetIntegrity,
  },
} as const;

type WebAssertion = FromSchema<typeof webAssertion>;

export default webAssertion;
export type { WebAssertion };
