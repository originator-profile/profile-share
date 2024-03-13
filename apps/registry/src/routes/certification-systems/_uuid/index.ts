import { FastifyInstance } from "fastify";
import * as getCertificationSystem from "./get-certification-system";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.route(getCertificationSystem);
}

export default index;
