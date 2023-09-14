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
      default: "https://oprexpt.originator-profile.org/",
    },
    AUTH0_DOMAIN: {
      type: "string",
      default: "oprdev.jp.auth0.com",
    },
    AUTH0_CLIENT_ID: {
      type: "string",
    },
    NODE_ENV: {
      type: "string",
    },
    MINIO_ACCOUNT_LOGO_BUCKET_NAME: {
      type: "string",
    },
    MINIO_ENDPOINT: {
      type: "string",
    },
  },
  required: ["ISSUER_UUID"],
} as const;

type Config = FromSchema<typeof Config>;

export default Config;
