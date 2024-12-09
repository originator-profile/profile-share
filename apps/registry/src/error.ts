import type { FromSchema, JSONSchema } from "json-schema-to-ts";

export const ErrorResponse = {
  type: "object",
  additionalProperties: true,
  properties: {
    statusCode: { type: "number" },
    error: { type: "string" },
    message: { type: "string" },
  },
} as const satisfies JSONSchema;

export type ErrorResponse = FromSchema<typeof ErrorResponse>;
