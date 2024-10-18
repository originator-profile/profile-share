import { FromSchema, JSONSchema } from "json-schema-to-ts";

export const AllowedUrl = {
  title: "Allowed URLs",
  type: "array",
  items: {
    type: "string",
    format: "uri",
  },
  description:
    "この Web Assertion によって表明される情報の対象となる URL の配列です。 配列の要素の文字列は必ず [URL Pattern strings](https://urlpattern.spec.whatwg.org/) 形式でなければなりません (MUST)。",
} as const satisfies JSONSchema;

export type AllowedUrl = FromSchema<typeof AllowedUrl>;
