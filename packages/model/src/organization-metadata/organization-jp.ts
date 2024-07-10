import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { Description } from "./description";

export const OrganizationJp = {
  title: "Organization JP",
  type: "object",
  additionalProperties: true,
  properties: {
    domain_name: {
      title: "ドメイン名 (RFC 4501)",
      type: "string",
    },
    url: {
      title: "ウェブサイトのURL",
      type: "string",
    },
    logo: {
      title: "ロゴ画像URL",
      type: "string",
    },
    "logo#integrity": {
      title: "Integrity Metadata",
      description: "https://www.w3.org/TR/SRI/#framework",
      type: "string",
    },
    country: {
      title: "国",
      type: "string",
      description: "ISO 3166-1 alpha-2",
      enum: ["JP"],
    },
    name: {
      title: "法人名",
      type: "string",
    },
    description: Description,
    corporate_number: {
      title: "法人番号",
      type: "string",
    },
    email: {
      title: "メールアドレス",
      type: "string",
    },
    phone_number: {
      title: "電話番号",
      type: "string",
    },
    postal_code: {
      title: "郵便番号",
      type: "string",
    },
    region: {
      title: "都道府県",
      type: "string",
    },
    locality: {
      title: "市区町村",
      type: "string",
    },
    street_address: {
      title: "丁目番地など",
      type: "string",
    },
    contact_title: {
      title: "連絡先表示名",
      type: "string",
    },
    contact_url: {
      title: "連絡先URL",
      type: "string",
    },
    privacy_policy_title: {
      title: "プライバシーポリシー表示名",
      type: "string",
    },
    privacy_policy_url: {
      title: "プライバシーポリシーURL",
      type: "string",
    },
    publishing_principle_title: {
      title: "編集ガイドライン表示名",
      type: "string",
    },
    publishing_principle_url: {
      title: "編集ガイドラインURL",
      type: "string",
    },
  },
  required: ["domain_name", "url", "country", "name", "corporate_number"],
} as const satisfies JSONSchema;

export type OrganizationJp = FromSchema<typeof OrganizationJp>;
