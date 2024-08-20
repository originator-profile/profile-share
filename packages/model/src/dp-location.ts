import { FromSchema } from "json-schema-to-ts";

/** @deprecated */
const DpLocation = {
  title: "Location",
  description: "対象の要素の場所を特定する CSS セレクター",
  type: "string",
} as const;

/** @deprecated */
type DpLocation = FromSchema<typeof DpLocation>;

export default DpLocation;
