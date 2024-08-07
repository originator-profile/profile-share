import { FromSchema } from "json-schema-to-ts";

const baseTargetIntegrity = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Base Target Integrity",
  type: "object",
  additionalProperties: true,
  properties: {
    type: {
      type: "string",
      enum: ["text", "visibleText", "html"],
    },
    integrity: {
      type: "string",
    },
    selector: {
      type: "string",
    },
  },
  required: ["type", "integrity", "selector"],
} as const;

type BaseTargetIntegrity = FromSchema<typeof baseTargetIntegrity>;

export default baseTargetIntegrity;
export type { BaseTargetIntegrity };
