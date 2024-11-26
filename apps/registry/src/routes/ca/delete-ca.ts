import type { FastifyRequest, FastifySchema } from "fastify";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";
import description from "./delete-ca.doc.md?raw";

export const method = "DELETE";
export const url = "/:id";

const params = {
  type: "object",
  properties: {
    id: {
      title: "CA ID",
      type: "string",
    },
  },
} as const as JSONSchema;

type Params = FromSchema<typeof params>;

export const schema = {
  operationId: "deleteCa",
  tags: ["ca"],
  description,
  params,
  response: {
    204: {
      description: `TODO: <https://github.com/originator-profile/profile/issues/1810>`,
    },
  },
} as const satisfies FastifySchema;

export async function handler(
  _: FastifyRequest<{ Params: Params }>,
): Promise<null> {
  // TODO: https://github.com/originator-profile/profile/issues/1810

  return null;
}
