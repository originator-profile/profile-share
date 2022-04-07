import { FromSchema } from "json-schema-to-ts";
import DpVisibleText from "./dp-visible-text";
import DpText from "./dp-text";
import DpHtml from "./dp-html";

const DpItem = {
  $id: "dp-item",
  title: "Document Profile Item",
  anyOf: [DpVisibleText, DpText, DpHtml],
} as const;

type DpItem = FromSchema<typeof DpItem>;

export default DpItem;
