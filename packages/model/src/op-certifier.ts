import { FromSchema } from "json-schema-to-ts";
import BusinessCategory from "./business-category";
import Logo from "./logo";

const OpCertifier = {
  $id: "op-certifier",
  title: "Originator Profile Certifier",
  description: "資格情報を発行する認証機構",
  type: "object",
  properties: {
    type: { const: "certifier" },
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
      $id: "op-certifier-business-category",
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
    streetAddress: {
      title: "番地・ビル名",
      type: "string",
    },
    contactTitle: {
      title: "連絡先表示名",
      type: "string",
    },
    contactUrl: {
      title: "連絡先URL",
      type: "string",
    },
    privacyPolicyTitle: {
      title: "プライバシーポリシー表示名",
      type: "string",
    },
    privacyPolicyUrl: {
      title: "プライバシーポリシーURL",
      type: "string",
    },
    publishingPrincipleTitle: {
      title: "編集ガイドライン表示名",
      type: "string",
    },
    publishingPrincipleUrl: {
      title: "編集ガイドラインURL",
      type: "string",
    },
    logos: {
      ...Logo,
      $id: "op-certifier-logo",
    },
  },
  required: [
    "type",
    "name",
    "url",
    "postalCode",
    "addressCountry",
    "addressRegion",
    "addressLocality",
    "streetAddress",
  ],
  additionalProperties: false,
} as const;

type OpCertifier = FromSchema<typeof OpCertifier>;

export default OpCertifier;
