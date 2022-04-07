import { FromSchema } from "json-schema-to-ts";
import DpItem from "./dp-item";

const Dp = {
  $id: "dp",
  title: "Document Profile",
  type: "object",
  properties: {
    item: {
      title: DpItem.title,
      type: "array",
      items: DpItem,
    },
  },
  required: ["item"],
  additionalProperties: false,
} as const;

type Dp = FromSchema<typeof Dp>;

export default Dp;
