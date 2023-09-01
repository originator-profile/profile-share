import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
  DoneFuncWithErrOrRes,
} from "fastify";
import helmet from "@fastify/helmet";
import auth0Verify from "fastify-auth0-verify";
import { BadRequestError } from "http-errors-enhanced";

export function preHandler(
  request: FastifyRequest,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes,
) {
  const user = request.user;
  if (user.permissions.includes("write:requests")) {
    done();
  } else {
    done(new BadRequestError("Insufficient permissions"));
  }
}

async function autohooks(fastify: FastifyInstance): Promise<void> {
  fastify.register(auth0Verify, {
    domain: "oprdev.jp.auth0.com",
    audience: "http://localhost:8080/",
  });
  fastify.after(() => {
    fastify.addHook("onRequest", fastify.authenticate);
    fastify.addHook("preHandler", preHandler);
  });
  fastify.register(helmet, {
    hsts: { preload: true },
  });
}

export default autohooks;
