import { FromSchema } from "json-schema-to-ts";
import Jwk from "./jwk";

const Jwks = {
  $id: "jwks",
  title: "JSON Web Key Sets",
  type: "object",
  properties: {
    keys: {
      title: Jwk.title,
      type: "array",
      items: Jwk,
    },
  },
  required: ["keys"],
  additionalProperties: false,
} as const;

type Jwks = FromSchema<typeof Jwks>;

export default Jwks;
