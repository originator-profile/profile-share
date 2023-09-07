import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../types";
import { update, schema } from "./update";
import { get, schema as schemaGET } from "./get";
import Params from "./params";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.put<FromHandler<typeof update, Params>>("/", { schema }, update);
  fastify.get<FromHandler<typeof get, Params>>("/", { schema: schemaGET }, get);
}

export default index;
