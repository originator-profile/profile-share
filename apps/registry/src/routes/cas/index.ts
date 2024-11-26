import type { FastifyInstance } from "fastify";
import * as readAllCas from "./read-all-cas";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.route(readAllCas);
}

export default index;
