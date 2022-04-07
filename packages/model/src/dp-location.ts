import { FromSchema } from "json-schema-to-ts";

const DpLocation = {
  $id: "dp-location",
  title: "Location",
  description: "対象の要素の場所を特定する CSS セレクター",
  type: "string",
} as const;

type DpLocation = FromSchema<typeof DpLocation>;

export default DpLocation;
