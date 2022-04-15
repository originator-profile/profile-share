import { FromSchema } from "json-schema-to-ts";

export const ErrorResponse = {
  type: "object",
  properties: {
    statusCode: { type: "number" },
    error: { type: "string" },
    message: { type: "string" },
  },
} as const;

export type ErrorResponse = FromSchema<typeof ErrorResponse>;
