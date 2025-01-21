import type { FastifyRequest, FastifySchema } from "fastify";
import description from "./get-wsp.doc.md?raw";
import { Params } from "./params";

export const method = "GET";
export const url = "/:url";

export const schema = {
  operationId: "getWsp",
  tags: ["sp"],
  description,
  params: Params,
  response: {
    200: {
      type: "string",
    },
  },
} as const satisfies FastifySchema;

export async function handler(
  req: FastifyRequest<{ Params: Params }>,
): Promise<string> {
  const wsp = await req.server.services.wspRepository.get(
    req.accountId as string,
    req.params.url,
  );

  return wsp;
}
