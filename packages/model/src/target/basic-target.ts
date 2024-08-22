import { FromSchema } from "json-schema-to-ts";

export const BasicTarget = {
  title: "Basic Target",
  type: "object",
  additionalProperties: true,
  properties: {
    type: {
      type: "string",
      enum: ["text", "visibleText", "html"],
    },
    integrity: {
      type: "string",
      description:
        "ハッシュ値の形式は Subresource Integrity セクション 3.1 の Integrity metadata でなければなりません (MUST)。",
    },
    selector: {
      type: "string",
      description: "CSS セレクター",
    },
  },
  required: ["type", "integrity", "selector"],
} as const;

export type BaseTarget = FromSchema<typeof BasicTarget>;
