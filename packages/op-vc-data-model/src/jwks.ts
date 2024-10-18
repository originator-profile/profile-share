import { FromSchema, JSONSchema } from "json-schema-to-ts";
import Jwk from "./jwk";

const Jwks = {
  title: "JSON Web Key Set",
  description: "JSON Web Key Set (JWK Set)",
  type: "object",
  properties: {
    keys: {
      title: Jwk.title,
      type: "array",
      items: Jwk,
    },
  },
  required: ["keys"],
  additionalProperties: true,
} as const satisfies JSONSchema;

type Jwks = FromSchema<typeof Jwks>;

export default Jwks;
