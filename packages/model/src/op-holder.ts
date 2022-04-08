import { FromSchema } from "json-schema-to-ts";
import BusinessCategory from "./business-category";
import Logo from "./logo";

const OpHolder = {
  $id: "op-holder",
  title: "Originator Profile Holder",
  description: "資格情報を保有する組織",
  type: "object",
  properties: {
    type: { const: "holder" },
    url: {
      title: "ウェブサイトのURL",
      type: "string",
    },
    name: {
      title: "法人名",
      type: "string",
    },
    description: {
      title: "説明",
      description:
        "ウェブメディアそれを運用する法人、認定機関、業界団体等であることの記述",
      type: "string",
    },
    businessCategory: {
      ...BusinessCategory,
      $id: "op-holder-business-category",
    },
    email: {
      title: "メールアドレス",
      type: "string",
    },
    phoneNumber: {
      title: "電話番号",
      type: "string",
    },
    postalCode: {
      title: "郵便番号",
      type: "string",
    },
    addressCountry: {
      title: "国",
      type: "string",
    },
    addressRegion: {
      title: "都道府県",
      type: "string",
    },
    addressLocality: {
      title: "市区町村",
      type: "string",
    },
    addressStreet: {
      title: "番地・ビル名",
      type: "string",
    },
    logo: {
      ...Logo,
      $id: "op-holder-logo",
    },
  },
  required: ["type"],
  additionalProperties: false,
} as const;

type OpHolder = FromSchema<typeof OpHolder>;

export default OpHolder;
