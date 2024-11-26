import type { FastifyRequest, FastifySchema } from "fastify";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";
import description from "./delete-cas.doc.md?raw";

export const method = "DELETE";
export const url = "";

const querystring = {
  type: "object",
  properties: {
    id: {
      title: "CA ID",
      type: "string",
    },
  },
} as const as JSONSchema;

type Querystring = FromSchema<typeof querystring>;

export const schema = {
  operationId: "deleteCas",
  tags: ["cas"],
  description,
  querystring,
  response: {
    204: {
      description: `TODO: <https://github.com/originator-profile/profile/issues/1810>`,
    },
  },
} as const satisfies FastifySchema;

export async function handler(
  _: FastifyRequest<{ Querystring: Querystring }>,
): Promise<null> {
  // TODO: https://github.com/originator-profile/profile/issues/1810

  return null;
}
