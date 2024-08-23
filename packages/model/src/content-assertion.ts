import { FromSchema } from "json-schema-to-ts";

export const ContentAssertion = {
  title: "Content Assertion",
  type: "object",
  additionalProperties: true,
  properties: {
    vct: {
      title: "The type of the Verifiable Credential",
      type: "string",
    },
    "vct#integrity": {
      type: "string",
      description:
        "ハッシュ値の形式は Subresource Integrity セクション 3.1 の Integrity metadata でなければなりません (MUST)。",
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
  },
  required: ["vct", "vct#integrity", "iss", "sub", "iat", "exp"],
} as const;

export type ContentAssertion = FromSchema<typeof ContentAssertion>;
