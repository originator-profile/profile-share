import { FromSchema, JSONSchema } from "json-schema-to-ts";

export const OpCipContext = {
  type: "array",
  additionalItems: false,
  minItems: 4,
  items: [
    {
      type: "string",
      const: "https://www.w3.org/ns/credentials/v2",
    },
    {
      type: "string",
      const: "https://originator-profile.org/ns/credentials/v1",
    },
    {
      type: "string",
      const: "https://originator-profile.org/ns/cip/v1",
    },
    {
      type: "object",
      properties: {
        "@language": {
          type: "string",
          title: "言語コード",
        },
      },
      required: ["@language"],
    },
  ],
} as const satisfies JSONSchema;

export type OpCipContext = FromSchema<typeof OpCipContext>;
