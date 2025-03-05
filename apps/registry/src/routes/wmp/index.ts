import type { FastifyInstance } from "fastify";
import * as createOrUpdateWmp from "./create-or-update-wmp";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.route(createOrUpdateWmp);
}

export default index;
