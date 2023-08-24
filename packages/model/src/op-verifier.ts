import { FromSchema } from "json-schema-to-ts";
import BusinessCategory from "./business-category";
import Logo from "./logo";

const OpVerifier = {
  title: "Originator Profile Verifier",
  description: "資格情報を検証する検証機関",
  type: "object",
  properties: {
    type: { const: "verifier" },
    domainName: {
      title: "ドメイン名",
      type: "string",
    },
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
    corporateNumber: {
      title: "法人番号",
      type: "string",
    },
    businessCategory: BusinessCategory,
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
    logos: Logo,
  },
  required: [
    "type",
    "domainName",
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

type OpVerifier = FromSchema<typeof OpVerifier>;

export default OpVerifier;
