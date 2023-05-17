import { FromSchema } from "json-schema-to-ts";

const Config = {
  type: "object",
  properties: {
    ISSUER_UUID: {
      type: "string",
      default: "",
    },
    APP_URL: {
      type: "string",
      default: "https://oprdev.herokuapp.com",
    },
    NODE_ENV: {
      type: "string",
    },
  },
  required: ["ISSUER_UUID"],
} as const;

type Config = FromSchema<typeof Config>;

export default Config;
