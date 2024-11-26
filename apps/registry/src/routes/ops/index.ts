import type { FastifyInstance } from "fastify";
import * as readAllOps from "./read-all-ops";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.route(readAllOps);
}

export default index;
