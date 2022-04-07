import { FromSchema } from "json-schema-to-ts";
import DpUrl from "./dp-url";
import DpLocation from "./dp-location";
import DpProof from "./dp-proof";

const DpVisibleText = {
  $id: "dp-visible-text",
  title: "Visible Text",
  description:
    "対象の要素のその子孫のレンダリングされたテキストとそのテキストへの署名",
  type: "object",
  properties: {
    type: { const: "visible-text" },
    url: {
      ...DpUrl,
      $id: "dp-visible-text-url",
    },
    location: {
      ...DpLocation,
      $id: "dp-visible-text-location",
    },
    proof: {
      ...DpProof,
      $id: "dp-visible-text-proof",
    },
  },
  required: ["type", "url", "location", "proof"],
  additionalProperties: false,
} as const;

type DpVisibleText = FromSchema<typeof DpVisibleText>;

export default DpVisibleText;
