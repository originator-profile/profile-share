import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { AllowedUrl } from "../allowed-url";
import { Category } from "../category";
import { OpCipContext } from "../context/op-cip-context";
import { Image } from "../image";
import { ContentAttestation } from "./content-attestation";

const subject = {
  type: "object",
  additionalProperties: false,
  properties: {
    id: {
      type: "string",
      format: "uri",
      description: "CA ID",
    },
    type: {
      type: "string",
      const: "ContentProperties",
    },
    title: {
      type: "string",
      description: "コンテンツのタイトル。",
    },
    description: {
      type: "string",
      description: "コンテンツの説明（プレーンテキスト）。",
    },
    source: {
      title: "一次ソース",
      type: "string",
      format: "uri",
      description:
        "コンテンツの流通における1次ソース URL がある場合は記載を推奨 (RECOMMENDED)。",
    },
    image: Image,
    datePublished: {
      title: "公開日",
      type: "string",
    },
    dateModified: {
      title: "最終更新日",
      type: "string",
    },
    editor: {
      // TODO 単一値を許す
      title: "編集者名",
      type: "array",
      items: {
        type: "string",
      },
    },
    author: {
      // TODO 単一値を許す
      title: "著者名",
      type: "array",
      items: {
        type: "string",
      },
    },
    category: {
      // TODO 単一値を許す
      type: "array",
      items: Category,
      description:
        "IAB カテゴリータクソノミーによる分類の JSON 配列。空配列でもよい (MAY)。",
    },
  },
  required: ["title", "description"],
} as const satisfies JSONSchema;

export const contentCA = {
  type: "object",
  additionalProperties: true,
  allOf: [
    ContentAttestation,
    {
      type: "object",
      additionalProperties: true,
      properties: {
        "@context": OpCipContext,
        credentialSubject: subject,
        allowedUrl: AllowedUrl,
        allowedOrigin: {
          enum: [],
        },
      },
      required: ["@context", "type", "credentialSubject", "allowedUrl"],
    },
  ],
} as const satisfies JSONSchema;

export type ContentCA = FromSchema<typeof contentCA>;
