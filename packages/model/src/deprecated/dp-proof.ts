import { FromSchema } from "json-schema-to-ts";

/** @deprecated */
const DpProof = {
  title: "Proof",
  description: "対象のテキストへの署名",
  type: "object",
  properties: {
    jws: {
      title: "Detached JSON Web Signature",
      type: "string",
    },
  },
  required: ["jws"],
  additionalProperties: false,
} as const;

/** @deprecated */
type DpProof = FromSchema<typeof DpProof>;

export default DpProof;
