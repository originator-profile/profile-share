import { ContentAttestationSet } from "@originator-profile/model";
import type { FastifyRequest, FastifySchema } from "fastify";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";

export const method = "GET";
export const url = "";

const querystring = {
  type: "object",
  properties: {
    id: {
      type: "array",
      items: {
        title: "CA ID",
        type: "string",
      },
    },
  },
} as const as JSONSchema;

type Querystring = FromSchema<typeof querystring>;

export const schema = {
  operationId: "readAllCas",
  tags: ["cas"],
  querystring,
  response: {
    200: {
      ...ContentAttestationSet,
      description: `TODO: <https://github.com/originator-profile/profile/issues/1605>`,
    },
  },
} as const satisfies FastifySchema;

export async function handler(
  _: FastifyRequest<{ Querystring: Querystring }>,
): Promise<ContentAttestationSet> {
  return []; // TODO: https://github.com/originator-profile/profile/issues/1605
}
