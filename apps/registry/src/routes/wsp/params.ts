import { FromSchema, JSONSchema } from "json-schema-to-ts";

export const Params = {
  type: "object",
  properties: {
    url: {
      title: "URL",
      type: "string",
      format: "uri",
    },
  },
  required: ["url"],
} as const satisfies JSONSchema;

export type Params = FromSchema<typeof Params>;
