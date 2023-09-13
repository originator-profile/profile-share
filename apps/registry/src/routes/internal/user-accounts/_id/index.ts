import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../types";
import { get, schema } from "./get";
import Params from "./params";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.get<FromHandler<typeof get, Params>>("/", { schema }, get);
}

export default index;
