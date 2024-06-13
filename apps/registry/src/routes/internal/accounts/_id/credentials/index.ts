import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../../types";
import { create, schema } from "./create";
import * as read from "./read";
import Params from "../params";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.post<FromHandler<typeof create, Params>>("/", { schema }, create);
  fastify.route(read);
}

export default index;
