import { FromSchema } from "json-schema-to-ts";
import DpVisibleText from "./dp-visible-text";
import DpText from "./dp-text";
import DpHtml from "./dp-html";
import OgWebsite from "./og-website";
import Advertisement from "./advertisement";

const DpItem = {
  title: "Document Profile Item",
  anyOf: [DpVisibleText, DpText, DpHtml, OgWebsite ,Advertisement],
} as const;

type DpItem = FromSchema<typeof DpItem>;

export default DpItem;
