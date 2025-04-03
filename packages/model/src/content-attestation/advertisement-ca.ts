import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { AllowedOrigin } from "../allowed-origin";
import { AllowedUrl } from "../allowed-url";
import { OpCipContext } from "../context/op-cip-context";
import { Image } from "../image";
import { ContentAttestation } from "./content-attestation";

const subject = {
  type: "object",
  additionalProperties: true,
  properties: {
    id: {
      type: "string",
      format: "uri",
      description: "CA ID",
    },
    type: {
      type: "string",
      const: "OnlineAd",
    },
    name: {
      type: "string",
      description: "広告のタイトル。",
    },
    description: {
      type: "string",
      description: "広告の説明（プレーンテキスト）。",
    },
    image: Image,
    genre: {
      title: "ジャンル",
      type: "string",
    },
  },
  required: ["id", "type", "name", "description"],
} as const satisfies JSONSchema;

const AdvertisementCA = {
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
      },
      required: ["@context", "type", "credentialSubject"],
    },
    {
      oneOf: [
        {
          type: "object",
          additionalProperties: true,
          properties: {
            allowedUrl: AllowedUrl,
            allowedOrigin: {
              enum: [],
            },
          },
          required: ["allowedUrl"],
        },
        {
          type: "object",
          additionalProperties: true,
          properties: {
            allowedUrl: {
              enum: [],
            },
            allowedOrigin: AllowedOrigin,
          },
          required: ["allowedOrigin"],
        },
      ],
    },
  ],
} as const satisfies JSONSchema;

export type AdvertisementCA = FromSchema<typeof AdvertisementCA>;
