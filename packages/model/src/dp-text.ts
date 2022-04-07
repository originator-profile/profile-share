import { FromSchema } from "json-schema-to-ts";
import DpUrl from "./dp-url";
import DpLocation from "./dp-location";
import DpProof from "./dp-proof";

const DpText = {
  $id: "dp-text",
  title: "Text",
  description: "対象の要素の子孫のテキストとそのテキストへの署名",
  type: "object",
  properties: {
    type: { const: "text" },
    url: {
      ...DpUrl,
      $id: "dp-text-url",
    },
    location: {
      ...DpLocation,
      $id: "dp-text-location",
    },
    proof: {
      ...DpProof,
      $id: "dp-text-proof",
    },
  },
  required: ["type", "url", "location", "proof"],
  additionalProperties: false,
} as const;

type DpText = FromSchema<typeof DpText>;

export default DpText;
