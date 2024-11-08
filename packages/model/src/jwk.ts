import { FromSchema, JSONSchema } from "json-schema-to-ts";

export const Jwk = {
  title: "JSON Web Key",
  type: "object",
  properties: {
    kty: {
      type: "string",
    },
    use: {
      type: "string",
    },
    key_ops: {
      type: "array",
      items: { type: "string" },
    },
    alg: {
      type: "string",
    },
    kid: {
      type: "string",
    },
    x5u: {
      type: "string",
    },
    x5c: {
      type: "array",
      items: {
        type: "string",
      },
    },
    x5t: {
      type: "string",
    },
    "x5t#S256": {
      type: "string",
    },
  },
  required: ["kty", "kid"],
  additionalProperties: true,
} as const satisfies JSONSchema;

export type Jwk = FromSchema<typeof Jwk>;
