import { FromSchema, JSONSchema } from "json-schema-to-ts";

export const BasicTarget = {
  title: "Basic Target",
  type: "object",
  additionalProperties: true,
  properties: {
    type: {
      type: "string",
      enum: [
        "TextTargetIntegrity",
        "VisibleTextTargetIntegrity",
        "HtmlTargetIntegrity",
      ],
    },
    integrity: {
      type: "string",
      description:
        "ハッシュ値の形式は Subresource Integrity セクション 3.1 の Integrity metadata でなければなりません (MUST)。",
    },
    cssSelector: {
      type: "string",
      description: "CSS セレクター",
    },
  },
  required: ["type", "integrity", "cssSelector"],
} as const satisfies JSONSchema;

export type BaseTarget = FromSchema<typeof BasicTarget>;
