import { FromSchema } from "json-schema-to-ts";
import OpItem from "./op-item";
import Jwks from "./jwks";

const Op = {
  title: "Originator Profile",
  type: "object",
  properties: {
    type: { const: "op" },
    issuer: {
      title: "Issuer",
      description: "認証機関または組織を表す一義的な識別子",
      type: "string",
    },
    subject: {
      title: "Subject",
      description:
        "メディア・広告などに関わる組織の身元またはその組織の主要な出版物を表す一義的な識別子",
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
      title: OpItem.title,
      type: "array",
      items: OpItem,
    },
    jwks: Jwks,
  },
  required: ["type", "issuer", "subject", "issuedAt", "expiredAt", "item"],
  additionalProperties: false,
} as const;

type Op = FromSchema<typeof Op>;

export default Op;
