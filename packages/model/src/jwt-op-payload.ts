import { FromSchema } from "json-schema-to-ts";
import OpItem from "./op-item";
import Jwks from "./jwks";

const JwtOpPayload = {
  title: "OP JWT Claims Set object",
  type: "object",
  properties: {
    iss: {
      title: "JWT Issuer",
      description:
        "[RFC7519#section-4.1.1](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1)",
      type: "string",
    },
    sub: {
      title: "JWT Subject",
      description:
        "[RFC7519#section-4.1.2](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2)",
      type: "string",
    },
    exp: {
      title: "JWT Expiration Time",
      description:
        "[RFC7519#section-4.1.4](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4)",
      type: "number",
    },
    iat: {
      title: "JWT Issued At",
      description:
        "[RFC7519#section-4.1.6](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6)",
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

type JwtOpPayload = FromSchema<typeof JwtOpPayload>;

export default JwtOpPayload;
