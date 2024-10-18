import { FromSchema, JSONSchema } from "json-schema-to-ts";

const Logo = {
  title: "Logo",
  type: "array",
  items: {
    title: "Logo",
    type: "object",
    properties: {
      url: {
        title: "ロゴ画像 URL",
        type: "string",
      },
      isMain: {
        title: "主なロゴ画像か否か",
        description: "true: 主なロゴ画像、それ以外: ロゴ画像の候補",
        type: "boolean",
      },
    },
    required: ["url", "isMain"],
    additionalProperties: false,
  },
} as const satisfies JSONSchema;

type Logo = FromSchema<typeof Logo>;

export default Logo;
