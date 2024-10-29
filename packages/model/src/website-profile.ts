import { OpVc } from "./op-vc";
import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { OpCipContext } from "./context/op-cip-context";

const subject = {
  type: "object",
  additionalProperties: true,
  properties: {
    id: {
      type: "string",
      title: "Web サイト保有者の OP ID",
      format: "uri",
    },
    type: {
      const: "WebsiteProperties",
    },
    title: {
      type: "string",
      description: "コンテンツのタイトル。",
    },
    description: {
      type: "string",
      description: "コンテンツの説明（プレーンテキスト）。",
    },
    image: {
      type: "object",
      title: "画像",
      properties: {
        id: { type: "string", format: "uri" },
        digestSRI: {
          type: "string",
          title: "Integrity Metadata",
          description: "Subresource Integrity (SRI) digest",
        },
      },
      required: ["id", "digestSRI"],
    },
    origin: {
      type: "string",
      description:
        "[Origin](https://www.rfc-editor.org/rfc/rfc6454) を [ASCII Serialization](https://www.rfc-editor.org/rfc/rfc6454#section-6.2) した文字列です。",
    },
  },
  required: ["id", "type", "title", "description", "origin"],
} as const satisfies JSONSchema;

export const WebsiteProfile = {
  title: "Web Media Profile",
  type: "object",
  additionalProperties: true,
  allOf: [
    OpVc,
    {
      type: "object",
      properties: {
        "@context": OpCipContext,
        type: {
          type: "array",
          minItems: 1,
          items: [{ const: "VerifiableCredential" }],
        },
        credentialSubject: subject,
      },
      required: ["@context", "type", "credentialSubject"],
    },
  ],
} as const satisfies JSONSchema;

export type WebsiteProfile = FromSchema<typeof WebsiteProfile>;
