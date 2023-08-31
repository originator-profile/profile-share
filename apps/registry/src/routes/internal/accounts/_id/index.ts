import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../types";
import { update, schema, preHandler } from "./update";
import { get, schema as schemaGET, preHandler as preHandlerGET } from "./get";
import Params from "./params";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.put<FromHandler<typeof update, Params>>(
    "/",
    { schema, preHandler},
    update,
  );
  fastify.get<FromHandler<typeof get, Params>>(
    "/",
    { schema: schemaGET, preHandler: preHandlerGET},
    get,
  );
}

export default index;
