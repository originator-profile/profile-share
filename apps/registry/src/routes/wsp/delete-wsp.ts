import type { FastifyReply, FastifyRequest, FastifySchema } from "fastify";
import description from "./delete-wsp.doc.md?raw";
import { Params } from "./params";

export const method = "DELETE";
export const url = "/:url";

export const schema = {
  operationId: "deleteWsp",
  tags: ["sp"],
  description,
  params: Params,
  response: {
    204: {},
  },
} as const satisfies FastifySchema;

export async function handler(
  req: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply,
): Promise<void> {
  await req.server.services.wspRepository.destroy(
    req.accountId as string,
    req.params.url,
  );

  reply.status(204);
}
