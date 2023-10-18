import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../../../types";
import { read, schema } from "./read";
import { deleteLatest, schema as schemaDelete } from "./delete";
import Params from "../../params";
import { preHandler } from "../../hooks";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.get<FromHandler<typeof read, Params>>("/", { schema: schema }, read);
  fastify.delete<FromHandler<typeof deleteLatest, Params>>(
    "/",
    { schema: schemaDelete, preHandler },
    deleteLatest,
  );
}

export default index;
