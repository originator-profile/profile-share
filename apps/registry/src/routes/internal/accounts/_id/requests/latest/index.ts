import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../../../types";
import { read, schema } from "./read";
import Params from "../../params";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.get<FromHandler<typeof read, Params>>("/", { schema: schema }, read);
}

export default index;
