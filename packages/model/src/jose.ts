import { FromSchema, JSONSchema } from "json-schema-to-ts";

const Header = {
  type: "object",
  additionalProperties: true,
  properties: {
    alg: {
      // TODO 説明
      const: "ES256",
    },
    typ: {
      title: "JWT Type Header Parameter",
      description:
        "[RFC 7519 Section 5.1](https://www.rfc-editor.org/rfc/rfc7519#section-5.1)",
      const: "vc-ld+jwt",
    },
    kid: {
      title: "JWS Key ID Header Parameter",
      description:
        "[RFC 7515 Section 4.1.4](https://www.rfc-editor.org/rfc/rfc7515.html#section-4.1.4)。[JWK Thumbprint](https://www.rfc-editor.org/rfc/rfc7638.html)でなければなりません (MUST)。",
      type: "string",
    },
    cty: {
      title: "JWT Context Type Header Parameter",
      description:
        "[RFC 7519 Section 5.2](https://www.rfc-editor.org/rfc/rfc7519#section-5.2)",
      const: "WMP",
    },
  },
  required: ["alg", "kid", "typ", "cty"],
} as const satisfies JSONSchema;

const Claimset = {
  type: "object",
  additionalProperties: true,
  properties: {
    iss: {
      title: "JWT Issuer",
      description:
        "[RFC 7519 Section 4.1.1](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1)。WMP 保有組織の CP 発行組織 の OP ID でなければなりません (MUST)。",
      type: "string",
      format: "uri",
    },
    sub: {
      title: "JWT Subject",
      description:
        "[RFC 7519 Section 4.1.2](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2)。WMP 保有組織の OP ID でなければなりません (MUST)",
      type: "string",
      format: "uri",
    },
    iat: {
      title: "JWT Issued At",
      description:
        "[RFC 7519 Section 4.1.6](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6)",
      type: "number",
    },
    exp: {
      title: "JWT Expiration Time",
      description:
        "[RFC 7519 Section 4.1.4](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4)",
      type: "number",
    },
  },
  required: ["iss", "sub", "iat", "exp"],
} as const satisfies JSONSchema;

export type Header = FromSchema<typeof Header>;
export type Claimset = FromSchema<typeof Claimset>;
