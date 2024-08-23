import { FromSchema } from "json-schema-to-ts";
import { AllowedOrigins } from "./allowed-origins";
import { ContentAssertion } from "./content-assertion";

const claims = {
  type: "object",
  additionalProperties: true,
  properties: {
    vct: {
      type: "string",
      const: "https://originator-profile.org/website",
    },
    target: {
      enum: [],
    },
    allowed_urls: {
      enum: [],
    },
    allowed_origins: AllowedOrigins,
  },
  required: ["vct", "allowed_origins"],
} as const;

const website = {
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
    locale: {
      type: "string",
      description: "Web コンテンツのロケール。",
    },
  },
  required: ["title", "description", "locale"],
} as const;

export const WebsiteMetadata = {
  title: "Website Metadata",
  allOf: [ContentAssertion, claims, website],
} as const;

export type WebsiteMetadata = FromSchema<typeof WebsiteMetadata>;
