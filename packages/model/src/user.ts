import { FromSchema, JSONSchema } from "json-schema-to-ts";

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
    name: {
      title: "名前",
      type: "string",
    },
    picture: {
      title: "画像",
      type: "string",
    },
  },
  required: ["id", "name", "picture"],
  additionalProperties: false,
} as const satisfies JSONSchema;

type User = FromSchema<typeof User>;

export default User;
