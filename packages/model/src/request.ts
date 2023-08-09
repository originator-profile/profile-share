import { FromSchema } from "json-schema-to-ts";

const Request = {
  title: "申請",
  description: "OP 発行申請",
  type: "object",
  properties: {
    status: {
      title: "ステータス",
      const: ["unreviewed", "reviewed", "cancelled"],
    },
    description: {
      title: "説明",
      type: "string",
    },
    createdAt: {
      title: "作成日時",
      type: "string",
      format: "date-time",
    },
  },
  required: ["status", "comments", "createdAt"],
  additionalProperties: false,
} as const;

type Request = FromSchema<typeof Request>;

export default Request;
