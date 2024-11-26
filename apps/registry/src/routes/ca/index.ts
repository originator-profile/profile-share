import type { FastifyInstance } from "fastify";
import * as createOrUpdateCa from "./create-or-update-ca";
import * as deleteCa from "./delete-ca";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.route(createOrUpdateCa);
  fastify.route(deleteCa);
}

export default index;
