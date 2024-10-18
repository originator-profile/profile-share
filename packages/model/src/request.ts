import { FromSchema, JSONSchema } from "json-schema-to-ts";
import ReviewComment from "./review-comment";

const Request = {
  title: "申請",
  description: "OP 発行申請",
  type: "object",
  properties: {
    group: {
      title: "組織名",
      type: "string",
    },
    status: {
      title: "承認フローステータス",
      enum: ["pending", "approved", "rejected", "cancelled"],
    },
    requestSummary: {
      title: "申請概要",
      type: "string",
    },
    reviewSummary: {
      title: "審査概要",
      type: "string",
    },
    reviewComments: {
      title: "審査コメント",
      type: "array",
      items: ReviewComment,
    },
    createdAt: {
      title: "作成日時",
      type: "string",
      format: "date-time",
    },
    updatedAt: {
      title: "更新日時",
      type: "string",
      format: "date-time",
    },
  },
  required: ["group", "status", "reviewComments", "createdAt", "updatedAt"],
  additionalProperties: false,
} as const satisfies JSONSchema;

type Request = FromSchema<typeof Request>;

export default Request;
