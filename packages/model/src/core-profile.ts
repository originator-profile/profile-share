import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { Jwks } from "./jwks";

export const CoreProfile = {
  type: "object",
  additionalProperties: false,
  properties: {
    "@context": {
      type: "array",
      additionalItems: false,
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
      additionalItems: false,
      minItems: 1,
      items: [{ const: "VerifiableCredential" }],
    },
    issuer: { type: "string" },
    credentialSubject: {
      type: "object",
      additionalProperties: false,
      properties: {
        id: { type: "string", format: "uri" },
        type: {
          const: "CoreProfile",
        },
        jwks: {
          ...Jwks,
          title: "保有組織の公開鍵の JSON Web Key Set",
        },
      },
      required: ["id", "type", "jwks"],
    },
  },
  required: ["@context", "type", "issuer", "credentialSubject"],
} as const satisfies JSONSchema;

export type CoreProfile = FromSchema<typeof CoreProfile>;
