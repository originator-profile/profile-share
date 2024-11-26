import { OriginatorProfileSet } from "@originator-profile/model";
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
        title: "OP ID",
        type: "string",
      },
    },
  },
} as const as JSONSchema;

type Querystring = FromSchema<typeof querystring>;

export const schema = {
  operationId: "readAllOps",
  tags: ["ops"],
  querystring,
  response: {
    200: {
      ...OriginatorProfileSet,
      description: `TODO: <https://github.com/originator-profile/profile/issues/1608>`,
    },
  },
} as const satisfies FastifySchema;

export async function handler(
  _: FastifyRequest<{ Querystring: Querystring }>,
): Promise<OriginatorProfileSet> {
  return []; // TODO: https://github.com/originator-profile/profile/issues/1608
}
