import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { OpVc } from "./op-vc";

const subject = {
  type: "object",
  additionalProperties: true,
  properties: {
    id: { title: " WMP 保有組織の OP ID", type: "string", format: "uri" },
    type: { const: "OnlineBusiness" },
    url: { title: "Web メディア URL", type: "string", format: "uri" },
    name: { title: "Web メディア名", type: "string" },
    logo: {
      type: "object",
      properties: {
        id: { title: "画像 URL", type: "string", format: "uri" },
        digestSRI: {
          title: "Integrity Metadata",
          description:
            "[SRI Section 3.5](https://www.w3.org/TR/SRI/#the-integrity-attribute)",
          type: "string",
        },
      },
      required: ["id", "digestSRI"],
    },
    email: { title: "メールアドレス", type: "string", format: "email" },
    telephone: { title: "電話番号", type: "string" },
    contactPoint: {
      type: "object",
      properties: {
        type: { const: "WebPage" },
        id: { title: "連絡先ページ URL", type: "string", format: "uri" },
        name: { title: "連絡先ページ表示名", type: "string" },
      },
      required: ["type", "id", "name"],
    },
    informationTransmissionPolicy: {
      type: "object",
      properties: {
        type: { const: "WebPage" },
        id: {
          title: "編集ガイドラインページ URL",
          type: "string",
          format: "uri",
        },
        name: { title: "編集ガイドラインページ表示名", type: "string" },
      },
      required: ["type", "id", "name"],
    },
    privacyPolicy: {
      type: "object",
      properties: {
        type: { const: "WebPage" },
        id: {
          title: "プライバシーポリシーページ URL",
          type: "string",
          format: "uri",
        },
        name: { title: "プライバシーポリシーページ表示名", type: "string" },
      },
      required: ["type", "id", "name"],
    },
    description: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: { const: "PlainTextDescription" },
        data: { type: "string" },
      },
    },
  },
  required: ["id", "type", "url", "name"],
} as const satisfies JSONSchema;

export const WebMediaProfile = {
  title: "Web Media Profile",
  type: "object",
  additionalProperties: true,
  allOf: [
    OpVc,
    {
      type: "object",
      properties: {
        type: {
          type: "array",
          minItems: 2,
          items: [
            { const: "VerifiableCredential" },
            { const: "WebMediaProfile" },
          ],
          additionalItems: false,
        },
        credentialSubject: subject,
      },
      required: ["type", "credentialSubject"],
    },
  ],
  required: ["type", "credentialSubject"],
} as const satisfies JSONSchema;

export type WebMediaProfile = FromSchema<typeof WebMediaProfile>;
