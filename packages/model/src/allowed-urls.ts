import { FromSchema } from "json-schema-to-ts";

const allowedUrls = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Allowed URLs",
  type: "array",
  items: {
    type: "string",
    format: "uri",
  },
  description:
    "この Web Assertion によって表明される情報の対象となる URL の配列です。 配列の要素の文字列は必ず [URL Pattern strings](https://urlpattern.spec.whatwg.org/) 形式でなければなりません (MUST)。",
} as const;

type AllowedUrls = FromSchema<typeof allowedUrls>;

export default allowedUrls;
export type { AllowedUrls };
