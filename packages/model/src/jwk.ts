import { FromSchema } from "json-schema-to-ts";

const Jwk = {
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
  required: ["kty"],
  additionalProperties: true,
} as const;

type Jwk = FromSchema<typeof Jwk>;

export default Jwk;
