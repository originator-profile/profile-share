import { FromSchema } from "json-schema-to-ts";

const User = {
  title: "ユーザー",
  description: "ユーザー",
  type: "object",
  properties: {
    id: {
      title: "ユーザーアカウント識別子",
      type: "string",
    },
    email: {
      title: "メールアドレス",
      type: "string",
    },
  },
  required: ["id", "email"],
  additionalProperties: false,
} as const;

type User = FromSchema<typeof User>;

export default User;
