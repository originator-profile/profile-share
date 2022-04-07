import { FromSchema } from "json-schema-to-ts";
import DpUrl from "./dp-url";
import DpLocation from "./dp-location";
import DpProof from "./dp-proof";

const DpHtml = {
  $id: "dp-html",
  title: "HTML",
  description: "対象の要素とその子孫を含む部分の HTML とその HTML への署名",
  type: "object",
  properties: {
    type: { const: "html" },
    url: {
      ...DpUrl,
      $id: "dp-html-url",
    },
    location: {
      ...DpLocation,
      $id: "dp-html-location",
    },
    proof: {
      ...DpProof,
      $id: "dp-html-proof",
    },
  },
  required: ["type", "url", "location", "proof"],
  additionalProperties: false,
} as const;

type DpHtml = FromSchema<typeof DpHtml>;

export default DpHtml;
