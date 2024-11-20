import { FromSchema, JSONSchema } from "json-schema-to-ts";

export const ExternalResourceTarget = {
  title: "External Resource Target",
  type: "object",
  additionalProperties: true,
  properties: {
    type: {
      type: "string",
      const: "ExternalResourceTargetIntegrity",
    },
    integrity: {
      type: "string",
      description:
        "ハッシュ値の形式は Subresource Integrity セクション 3.1 の Integrity metadata でなければなりません (MUST)。",
    },
  },
  required: ["type", "integrity"],
} as const satisfies JSONSchema;

export type ExternalResourceTarget = FromSchema<typeof ExternalResourceTarget>;
