import { FromSchema } from "json-schema-to-ts";

const DpProof = {
  $id: "dp-proof",
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

type DpProof = FromSchema<typeof DpProof>;

export default DpProof;
