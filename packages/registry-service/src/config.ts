import { FromSchema } from "json-schema-to-ts";

const Config = {
  type: "object",
  properties: {
    ISSUER_UUID: {
      type: "string",
      default: "",
    },
    JSONLD_CONTEXT: {
      type: "string",
      default: "http://localhost:8080/context",
    },
  },
  required: ["ISSUER_UUID", "JSONLD_CONTEXT"],
} as const;

type Config = FromSchema<typeof Config>;

export default Config;
