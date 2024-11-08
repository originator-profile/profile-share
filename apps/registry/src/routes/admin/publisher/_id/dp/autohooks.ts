import { FastifyInstance } from "fastify";
import { ForbiddenError } from "http-errors-enhanced";
import Params from "./params";

async function autohooks(fastify: FastifyInstance): Promise<void> {
  fastify.addHook("preHandler", async (request) => {
    if (request.accountId !== (request.params as Params).id) {
      throw new ForbiddenError("Invalid account ID");
    }
  });
}

export default autohooks;
