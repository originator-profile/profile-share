import { FromSchema } from "json-schema-to-ts";

const ReviewComment = {
  title: "審査コメント",
  description: "OP 発行申請の内容に対するコメント",
  type: "object",
  properties: {
    location: {
      title: "箇所 (入れ子オブジェクトプロパティ名",
      type: "string",
    },
    comment: {
      title: "string",
      type: "string",
    },
  },
  required: ["location", "comment"],
  additionalProperties: false,
} as const;

type ReviewComment = FromSchema<typeof ReviewComment>;

export default ReviewComment;
