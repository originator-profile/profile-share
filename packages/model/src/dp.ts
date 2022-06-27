import { FromSchema } from "json-schema-to-ts";
import DpItem from "./dp-item";

const Dp = {
  title: "Document Profile",
  type: "object",
  properties: {
    type: { const: "dp" },
    issuer: {
      title: "Issuer",
      description: "組織を表す一義的な識別子",
      type: "string",
    },
    subject: {
      title: "Subject",
      description: "出版物を表す一義的な識別子",
      type: "string",
    },
    issuedAt: {
      title: "発行日時",
      type: "string",
      format: "date-time",
    },
    expiredAt: {
      title: "有効期限",
      type: "string",
      format: "date-time",
    },
    item: {
      title: DpItem.title,
      type: "array",
      items: DpItem,
    },
  },
  required: ["type", "issuer", "subject", "issuedAt", "expiredAt", "item"],
  additionalProperties: false,
} as const;

type Dp = FromSchema<typeof Dp>;

export default Dp;
