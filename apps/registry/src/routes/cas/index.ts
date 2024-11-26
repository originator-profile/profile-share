import type { FastifyInstance } from "fastify";
import * as createOrUpdateCas from "./create-or-update-cas";
import * as deleteCas from "./delete-cas";
import * as readAllCas from "./read-all-cas";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.route(createOrUpdateCas);
  fastify.route(deleteCas);
  fastify.route(readAllCas);
}

export default index;
