import { FromSchema } from "json-schema-to-ts";

const Was = {
  deprecated: true,
  title: "Web Assertion Set",
  type: "object",
  properties: {
    type: { const: "was" },
    originator: {
      title: "SD-JWT VC 形式の OP",
      description: "REQUIRED. SD-JWT VC 形式の OP です。 OP は必ず WA 発行者の公開鍵が含まれなければなりません (MUST)。 検証者は OP の検証を拒否するとき、WA の検証処理を拒否してもよい (MAY) です。",
      type: "string",
    },
    certificates: {
      title: "SD-JWT VC の配列",
      description: "REQUIRED. SD-JWT VC の配列です。必ず要素を1つ以上持つ必要があります (MUST)。 提示者はその OP に関連する SD-JWT VC を含めるべき (SHOULD) です。",
      type: "array",
      items: {
        type: "string"
      }
    },
    assertions: {
      title: "SD-JWT VC 形式の WA の配列",
      description: "REQUIRED. SD-JWT VC 形式の WA の配列です。必ず WA を1つ以上持つ必要があります (MUST)。",
      type: "array",
      items: {
        type: "string"
      }
    },
  },
  required: ["originator", "certificates", "assertions"],
  additionalProperties: true,
} as const;

type Was = FromSchema<typeof Was>;

export default Was;
