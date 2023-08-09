import { FromSchema } from "json-schema-to-ts";
import ReviewComment from "./review-comment";

const Review = {
  title: "審査",
  description: "OP 発行申請に対する審査",
  type: "object",
  properties: {
    status: {
      title: "ステータス",
      const: ["pending", "accepted", "rejected"],
    },
    description: {
      title: "説明",
      type: "string",
    },
    comments: {
      title: "コメント",
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
  required: ["status", "comments", "createdAt", "updatedAt"],
  additionalProperties: false,
} as const;

type Review = FromSchema<typeof Review>;

export default Review;
