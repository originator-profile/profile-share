import { parseCaId } from "@originator-profile/core";
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
      format: "uuid",
    },
  },
  required: ["id"],
} as const satisfies JSONSchema;

type Params = FromSchema<typeof params>;

export const schema = {
  operationId: "deleteCa",
  tags: ["ca"],
  description,
  params,
  response: {
    204: {},
  },
} as const satisfies FastifySchema;

export async function preValidation(
  req: FastifyRequest<{ Params: Params }>,
): Promise<void> {
  req.params.id = parseCaId(req.params.id);
}

export async function handler(
  req: FastifyRequest<{ Params: Params }>,
): Promise<void> {
  await req.server.services.caRepository.destroy(
    req.accountId as string,
    req.params.id,
  );
}
