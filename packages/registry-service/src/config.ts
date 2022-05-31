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
      default: "https://oprdev.herokuapp.com/context",
    },
  },
  required: ["ISSUER_UUID"],
} as const;

type Config = FromSchema<typeof Config>;

export default Config;
