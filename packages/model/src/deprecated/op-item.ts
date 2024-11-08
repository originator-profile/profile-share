import { FromSchema } from "json-schema-to-ts";
import OpCertifier from "./op-certifier";
import OpCredential from "./op-credential";
import OpHolder from "./op-holder";
import OpVerifier from "./op-verifier";

/** @deprecated */
const OpItem = {
  deprecated: true,
  title: "Originator Profile Item",
  anyOf: [OpHolder, OpCredential, OpCertifier, OpVerifier],
} as const;

/** @deprecated */
type OpItem = FromSchema<typeof OpItem>;

export default OpItem;
