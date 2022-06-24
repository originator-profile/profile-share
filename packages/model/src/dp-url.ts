import { FromSchema } from "json-schema-to-ts";

const DpUrl = {
  title: "URL",
  description: "対象の要素が存在するページの URL",
  type: "string",
} as const;

type DpUrl = FromSchema<typeof DpUrl>;

export default DpUrl;
