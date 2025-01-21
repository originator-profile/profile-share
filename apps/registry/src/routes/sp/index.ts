import type { FastifyInstance } from "fastify";
import * as createOrUpdateSp from "./create-or-update-sp";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.route(createOrUpdateSp);
}

export default index;
