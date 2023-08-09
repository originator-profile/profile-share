import { FromSchema } from "json-schema-to-ts";

const ReviewComment = {
  title: "審査コメント",
  description: "OP 発行申請の内容に対するコメント",
  type: "object",
  properties: {
    requestFieldName: {
      title: "申請項目名 (HTML 要素の name 属性)",
      type: "string",
    },
    comment: {
      title: "string",
      type: "string",
    },
  },
  required: ["requestFieldName", "comment"],
  additionalProperties: false,
} as const;

type ReviewComment = FromSchema<typeof ReviewComment>;

export default ReviewComment;
