import { FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";

async function autohooks(fastify: FastifyInstance): Promise<void> {
  fastify.register(helmet, {
    hsts: { preload: true },
  });
}

export default autohooks;
