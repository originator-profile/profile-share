import { FromSchema } from "json-schema-to-ts";

const allowedUrls = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Allowed URLs",
  type: "array",
  items: {
    type: "string",
    format: "uri",
  },
} as const;

type AllowedUrls = FromSchema<typeof allowedUrls>;

export default allowedUrls;
export type { AllowedUrls };
