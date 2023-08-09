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
    summary: {
      title: "概要",
      type: "string",
    },
    createdAt: {
      title: "作成日時",
      type: "string",
      format: "date-time",
    },
  },
  required: ["status", "summary", "createdAt"],
  additionalProperties: false,
} as const;

type Request = FromSchema<typeof Request>;

export default Request;
