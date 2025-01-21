import type { FastifyInstance } from "fastify";
import * as createOrUpdateWsp from "./create-or-update-wsp";
import * as deleteWsp from "./delete-wsp";
import * as getWsp from "./get-wsp";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.route(createOrUpdateWsp);
  fastify.route(deleteWsp);
  fastify.route(getWsp);
}

export default index;
