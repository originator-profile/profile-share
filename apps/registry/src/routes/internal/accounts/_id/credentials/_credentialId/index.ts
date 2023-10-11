import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../../../types";
import { update, schema } from "./update";
import { deleteOne, schema as schemaDelete } from "./delete";
import Params from "./params";
import { preHandler } from "../../hooks";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.put<FromHandler<typeof update, Params>>(
    "/",
    { schema: schema, preHandler },
    update,
  );
  fastify.delete<FromHandler<typeof deleteOne, Params>>(
    "/",
    { schema: schemaDelete, preHandler },
    deleteOne,
  );
}

export default index;
