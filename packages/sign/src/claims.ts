import { FromSchema } from "json-schema-to-ts";
import { JWTPayload } from "jose";
import OpItem from "@webdino/profile-model/src/op-item";
import Jwks from "@webdino/profile-model/src/jwks";
import DpItem from "@webdino/profile-model/src/dp-item";

export const JwtOpPayload = {
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
    "https://opr.webdino.org/jwt/claims/op": {
      type: "object",
      properties: {
        item: { type: "array", items: OpItem },
        jwks: Jwks,
      },
      required: ["item"],
      additionalProperties: false,
    },
  },
  required: [
    "iss",
    "sub",
    "exp",
    "iat",
    "https://opr.webdino.org/jwt/claims/op",
  ],
  additionalProperties: false,
} as const;

/** OP JWT Claims Set object */
export type JwtOpPayload = FromSchema<typeof JwtOpPayload>;

export const JwtDpPayload = {
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
    "https://opr.webdino.org/jwt/claims/dp": {
      type: "object",
      properties: {
        item: { type: "array", items: DpItem },
      },
      required: ["item"],
      additionalProperties: false,
    },
  },
  required: [
    "iss",
    "sub",
    "exp",
    "iat",
    "https://opr.webdino.org/jwt/claims/dp",
  ],
  additionalProperties: false,
} as const;

/** DP JWT Claims Set object */
export type JwtDpPayload = FromSchema<typeof JwtDpPayload>;

export const JwtProfilePayload = {
  title: "Profile JWT Claims Set object",
  anyOf: [JwtOpPayload, JwtDpPayload],
} as const;

/** Profile JWT Claims Set object */
export type JwtProfilePayload = FromSchema<typeof JwtProfilePayload>;

/**
 * JwtOpPayload 型であるか否か
 * @param payload
 * @return JwtOpPayload 型であれば true、それ以外ならば false
 */
export function isJwtOpPayload(payload: JWTPayload): payload is JwtOpPayload {
  return "https://opr.webdino.org/jwt/claims/op" in payload;
}

/**
 * JwtDpPayload 型であるか否か
 * @param payload
 * @return JwtDpPayload 型であれば true、それ以外ならば false
 */
export function isJwtDpPayload(payload: JWTPayload): payload is JwtDpPayload {
  return "https://opr.webdino.org/jwt/claims/dp" in payload;
}
