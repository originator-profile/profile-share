import type { FastifyInstance } from "fastify";
import * as createOrUpdatePa from "./create-or-update-pa";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.route(createOrUpdatePa);
}

export default index;
