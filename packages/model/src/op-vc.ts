import { FromSchema, JSONSchema } from "json-schema-to-ts";

export const OpVc = {
  type: "object",
  additionalProperties: true,
  properties: {
    "@context": {
      type: "array",
      additionalItems: true,
      minItems: 2,
      items: [
        {
          const: "https://www.w3.org/ns/credentials/v2",
        },
        {
          const: "https://originator-profile.org/ns/credentials/v1",
        },
      ],
    },
    type: {
      type: "array",
      additionalItems: true,
      minItems: 1,
      items: [{ const: "VerifiableCredential" }],
    },
    issuer: { type: "string", format: "uri" },
    credentialSubject: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: { type: "string", format: "uri" },
      },
      required: ["id"],
    },
    iss: { type: "string" },
    sub: { type: "string" },
    iat: { type: "number" },
    exp: { type: "number" },
    aud: { type: "string" },
    jti: { type: "string" },
    nbf: { type: "number" },
  },
  required: ["@context", "type", "issuer", "credentialSubject"],
} as const satisfies JSONSchema;

export type OpVc = FromSchema<typeof OpVc>;
