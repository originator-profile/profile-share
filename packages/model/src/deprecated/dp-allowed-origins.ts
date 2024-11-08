import { FromSchema, JSONSchema } from "json-schema-to-ts";

/** @deprecated */
const DpAllowedOrigins = {
  title: "Allowed Origins",
  description: "利用可能なオリジンのリスト",
  type: "array",
  items: {
    title: "Allowed Origin",
    description: "利用可能なオリジン",
    type: "string",
  },
} as const satisfies JSONSchema;

/** @deprecated */
type DpAllowedOrigins = FromSchema<typeof DpAllowedOrigins>;

export default DpAllowedOrigins;
