import { FastifySchema, FastifyRequest, FastifyReply } from "fastify";
import Params from "./params";

export const method = "GET";
export const url = "/sop";

export const schema = {
  operationId: "account.getSignedOriginatorProfile",
  tags: ["SOP"],
  params: Params,
  produces: ["application/jwt"],
  response: {
    200: {
      title: "Signed Originator Profile",
      description: "Signed Originator Profile (SOP)",
      type: "string",
    },
  },
} satisfies FastifySchema;

export async function handler(
  req: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply,
): Promise<string> {
  reply.type(schema.produces[0]);
  return await req.server.services.account.getSop(req.params.id);
}
