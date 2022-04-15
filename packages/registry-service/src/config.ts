import { FromSchema } from "json-schema-to-ts";

const Config = {
  type: "object",
  properties: {
    PORT: {
      type: "string",
      default: "8080",
    },
    ISSUER_UUID: {
      type: "string",
    },
    JSONLD_CONTEXT: {
      type: "string",
      default: "http://localhost:8080/context",
    },
  },
  required: ["PORT", "ISSUER_UUID", "JSONLD_CONTEXT"],
} as const;

type Config = FromSchema<typeof Config>;

export default Config;
