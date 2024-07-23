import helmet from "@fastify/helmet";
import { FastifyInstance } from "fastify";
import { ForbiddenError } from "http-errors-enhanced";
import Params from "./params";

async function autohooks(fastify: FastifyInstance): Promise<void> {
  fastify.after(() =>
    fastify.addHook("onRequest", (request, reply, done) => {
      if (request.accountId !== (request.params as Params).id) {
        throw new ForbiddenError("Invalid account ID");
      }
      done();
    }),
  );
  fastify.register(helmet, {
    hsts: { preload: true },
  });
}

export default autohooks;
