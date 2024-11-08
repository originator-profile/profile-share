import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { OpCipContext } from "./context/op-cip-context";
import { Image } from "./image";
import { OpVc } from "./op-vc";

const subject = {
  type: "object",
  additionalProperties: true,
  properties: {
    id: {
      type: "string",
      title: "Web サイトの URL",
      format: "uri",
    },
    type: {
      const: "WebSite",
    },
    name: {
      type: "string",
      title: "Web サイトの名称",
    },
    image: Image,
    description: {
      type: "string",
      title: "Web サイトの説明",
    },
    url: {
      title:
        "[Origin](https://www.rfc-editor.org/rfc/rfc6454) を [ASCII Serialization](https://www.rfc-editor.org/rfc/rfc6454#section-6.2) した文字列です。",
      anyOf: [
        { type: "string" },
        {
          type: "array",
          items: { type: "string" },
        },
      ],
    },
  },
  required: ["id", "type", "name", "url"],
} as const satisfies JSONSchema;

export const WebsiteProfile = {
  title: "Website Profile",
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
          minItems: 2,
          items: [
            { const: "VerifiableCredential" },
            { const: "WebsiteProfile" },
          ],
        },
        credentialSubject: subject,
      },
      required: ["@context", "type", "credentialSubject"],
    },
  ],
} as const satisfies JSONSchema;

export type WebsiteProfile = FromSchema<typeof WebsiteProfile>;
