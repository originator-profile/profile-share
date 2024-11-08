import { FromSchema } from "json-schema-to-ts";
import { Jwks } from "../jwks";
import OpItem from "./op-item";

/** @deprecated */
const JwtOpPayload = {
  deprecated: true,
  title: "OP JWT Claims Set object",
  type: "object",
  properties: {
    iss: {
      title: "JWT Issuer",
      description:
        "[RFC 7519 Section 4.1.1](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1)",
      type: "string",
    },
    sub: {
      title: "JWT Subject",
      description:
        "[RFC 7519 Section 4.1.2](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2)",
      type: "string",
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
    "https://originator-profile.org/op": {
      type: "object",
      properties: {
        item: { type: "array", items: OpItem },
        jwks: Jwks,
      },
      required: ["item"],
      additionalProperties: false,
    },
  },
  required: ["iss", "sub", "exp", "iat", "https://originator-profile.org/op"],
  additionalProperties: false,
} as const;

/** @deprecated */
type JwtOpPayload = FromSchema<typeof JwtOpPayload>;

export default JwtOpPayload;
