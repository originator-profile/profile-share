import { FastifyInstance } from "fastify";
import * as getSop from "./get-sop";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.route(getSop);
}

export default index;
