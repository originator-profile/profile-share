import { FromSchema, JSONSchema } from "json-schema-to-ts";

export const TargetIntegrity = {
  title: "Target Integrity",
  type: "object",
  additionalProperties: true,
  properties: {
    type: {
      type: "string",
      title: "ターゲットの種類",
    },
  },
  required: ["type"],
} as const satisfies JSONSchema;

export type TargetIntegrity = FromSchema<typeof TargetIntegrity>;
