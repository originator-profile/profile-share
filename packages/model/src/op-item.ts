import { FromSchema } from "json-schema-to-ts";
import OpHolder from "./op-holder";
import OpCredential from "./op-credential";
import OpCertifier from "./op-certifier";

const OpItem = {
  $id: "op-item",
  title: "Originator Profile Item",
  anyOf: [OpHolder, OpCredential, OpCertifier],
} as const;

type OpItem = FromSchema<typeof OpItem>;

export default OpItem;
