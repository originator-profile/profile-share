import { FastifyInstance } from "fastify";
import * as register from "./register";
import * as destroy from "./destroy";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.route(register);
  fastify.route(destroy);
}

export default index;
