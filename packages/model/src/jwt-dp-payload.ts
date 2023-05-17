import { FromSchema } from "json-schema-to-ts";
import DpItem from "./dp-item";

const JwtDpPayload = {
  title: "DP JWT Claims Set object",
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
    "https://originator-profile.org/dp": {
      type: "object",
      properties: {
        item: { type: "array", items: DpItem },
      },
      required: ["item"],
      additionalProperties: false,
    },
    /** @deprecated Use "https://originator-profile.org/op" */
    "https://opr.webdino.org/jwt/claims/dp": {
      deprecated: true,
      type: "object",
      properties: {
        item: { type: "array", items: DpItem },
      },
      required: ["item"],
      additionalProperties: false,
    },
  },
  required: ["iss", "sub", "exp", "iat"],
  oneOf: [
    { required: ["https://originator-profile.org/dp"] },
    { required: ["https://opr.webdino.org/jwt/claims/dp"] },
  ],
  additionalProperties: false,
} as const;

type JwtDpPayload = FromSchema<typeof JwtDpPayload>;

export default JwtDpPayload;
