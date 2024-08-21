import { FromSchema } from "json-schema-to-ts";

const SingleWebAssertionSet = {
  title: "Web Assertion Set",
  type: "object",
  properties: {
    type: { const: "was" },
    originator: {
      title: "SD-JWT VC 形式の OP",
      description:
        "REQUIRED. SD-JWT VC 形式の OP です。 OP は必ず WA 発行者の公開鍵が含まれなければなりません (MUST)。 検証者は OP の検証を拒否するとき、WA の検証処理を拒否してもよい (MAY) です。",
      type: "string",
    },
    certificates: {
      title: "SD-JWT VC の配列",
      description:
        "REQUIRED. SD-JWT VC の配列です。必ず要素を1つ以上持つ必要があります (MUST)。 提示者はその OP に関連する SD-JWT VC を含めるべき (SHOULD) です。",
      type: "array",
      items: {
        type: "string",
      },
    },
    assertions: {
      title: "SD-JWT VC 形式の WA の配列",
      description:
        "REQUIRED. SD-JWT VC 形式の WA の配列です。必ず WA を1つ以上持つ必要があります (MUST)。",
      type: "array",
      items: {
        type: "string",
      },
    },
    main: {
      title:
        "文書の中心的なトピックか否かの真偽値(true: メインコンテンツ、false: それ以外)",
      description:
        "main が true の JSON Object の中の assertions 配列は要素数が1でなければなりません",
      type: "boolean",
      default: false,
    },
  },
  required: ["originator", "certificates", "assertions"],
  additionalProperties: true,
} as const;

const WebAssertionSet = {
  title: "Web Assertion Set",
  oneOf: [
    SingleWebAssertionSet,
    {
      type: "array",
      items: SingleWebAssertionSet,
    },
  ],
} as const;

export type SingleWebAssertionSet = FromSchema<typeof SingleWebAssertionSet>;
type WebAssertionSet = FromSchema<typeof WebAssertionSet>;

export default WebAssertionSet;
