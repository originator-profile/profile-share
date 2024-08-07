import { FromSchema } from "json-schema-to-ts";
import Category from "./category";

const contentMetadata = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Content Metadata",
  type: "object",
  additionalProperties: true,
  properties: {
    vct: {
      type: "string",
      const: "https://originator-profile.org/content",
      description:
        "必ず https://originator-profile.org/content でなければなりません (MUST)。",
    },
    allowed_urls: {
      $ref: "#/$defs/allowed_urls",
      description: "Web Assertion に登録済みのクレーム。",
    },
    allowed_origins: {
      type: "array",
      items: {
        type: "string",
        format: "uri",
      },
      description:
        "Web Assertion に登録済みのクレーム。含めてはいけません (MUST NOT)。",
    },
  },
  required: ["vct", "allowed_urls"],
  $defs: {
    base_target_integrity: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          enum: ["text", "visibleText", "html"],
        },
        integrity: {
          type: "string",
        },
        selector: {
          type: "string",
        },
      },
      required: ["type", "integrity", "selector"],
    },
    external_resource_target_integrity: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          enum: ["externalResource"],
        },
        integrity: {
          type: "string",
        },
        url: {
          type: "string",
          format: "uri",
        },
      },
      required: ["type", "integrity", "url"],
    },
    target_integrity: {
      oneOf: [
        { $ref: "#/$defs/base_target_integrity" },
        { $ref: "#/$defs/external_resource_target_integrity" },
      ],
    },
    allowed_urls: {
      type: "array",
      items: {
        type: "string",
        format: "uri",
      },
    },
    assertion: {
      type: "object",
      additionalProperties: true,
      properties: {
        allowed_urls: { $ref: "#/$defs/allowed_urls" },
        target: {
          type: "array",
          items: {
            $ref: "#/$defs/target_integrity",
          },
          minItems: 1,
          description: "Web Assertion に登録済みのクレーム。",
        },
      },
      required: ["allowed_urls", "target"],
    },
    content: {
      type: "object",
      additionalProperties: true,
      properties: {
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
        image: {
          type: "string",
          format: "uri",
          description:
            "コンテンツの画像の URL。コンテンツに強い関連をもつ画像があるならば、その画像を指定するべきです (RECOMMENDED)。",
        },
        "image#integrity": {
          type: "string",
          description:
            "コンテンツの画像のハッシュ値を指定します。ハッシュ値の形式は Subresource Integrity セクション 3.1 の Integrity metadata でなければなりません (MUST)。",
        },
        date_published: {
          title: "公開日",
          type: "string",
        },
        date_modified: {
          title: "最終更新日",
          type: "string",
        },
        editors: {
          title: "編集者名",
          type: "array",
          items: {
            type: "string",
          },
        },
        authors: {
          title: "著者名",
          type: "array",
          items: {
            type: "string",
          },
        },
        categories: {
          type: "array",
          items: {
            $ref: Category,
          },
          description:
            "IAB カテゴリータクソノミーによる分類の JSON 配列。空配列でもよい (MAY)。",
        },
        locale: {
          type: "string",
          description: "Web コンテンツのロケール。",
        },
      },
      required: ["title", "description", "locale"],
    },
  },
  allOf: [{ $ref: "#/$defs/assertion" }, { $ref: "#/$defs/content" }],
} as const;

type ContentMetadata = FromSchema<typeof contentMetadata>;

export default contentMetadata;
export type { ContentMetadata };
