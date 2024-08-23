import { FromSchema } from "json-schema-to-ts";
import { AllowedOrigins } from "./allowed-origins";
import { AllowedUrls } from "./allowed-urls";
import Category from "./category";
import { ContentAssertion } from "./content-assertion";
import { Target } from "./target";

const claims = {
  type: "object",
  additionalProperties: true,
  properties: {
    vct: {
      type: "string",
      const: "https://originator-profile.org/advertisement",
    },
    target: {
      type: "array",
      items: Target,
      minItems: 1,
    },
  },
  required: ["vct", "target"],
  oneOf: [
    {
      properties: {
        allowed_urls: AllowedUrls,
        allowed_origins: {
          enum: [],
        },
      },
      required: ["allowed_urls"],
    },
    {
      properties: {
        allowed_urls: {
          enum: [],
        },
        allowed_origins: AllowedOrigins,
      },
      required: ["allowed_origins"],
    },
  ],
} as const;

const advertisement = {
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
    categories: {
      type: "array",
      items: Category,
      description:
        "IAB カテゴリータクソノミーによる分類の JSON 配列。空配列でもよい (MAY)。",
    },
    locale: {
      type: "string",
      description: "Web コンテンツのロケール。",
    },
  },
  required: ["title", "description", "locale"],
} as const;

export const AdvertisementMetadata = {
  title: "Advertisement Metadata",
  allOf: [ContentAssertion, claims, advertisement],
} as const;

export type AdvertisementMetadata = FromSchema<typeof AdvertisementMetadata>;
