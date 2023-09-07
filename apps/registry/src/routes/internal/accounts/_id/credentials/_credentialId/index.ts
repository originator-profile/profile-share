import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../../../types";
import { update, schema } from "./update";
import { deleteOne, schema as schemaDelete } from "./delete";
import Params from "./params";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.put<FromHandler<typeof update, Params>>(
    "/",
    { schema: schema },
    update,
  );
  fastify.delete<FromHandler<typeof deleteOne, Params>>(
    "/",
    { schema: schemaDelete },
    deleteOne,
  );
}

export default index;
