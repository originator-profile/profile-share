import { FromSchema, JSONSchema } from "json-schema-to-ts";

export const OpContext = {
  type: "array",
  additionalItems: false,
  minItems: 3,
  items: [
    {
      const: "https://www.w3.org/ns/credentials/v2",
    },
    {
      const: "https://originator-profile.org/ns/credentials/v1",
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

export type OpContext = FromSchema<typeof OpContext>;
