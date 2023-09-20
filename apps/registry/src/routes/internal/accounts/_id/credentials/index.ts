import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../../types";
import { create, schema } from "./create";
import Params from "../params";
import { preHandler } from "./hooks";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.post<FromHandler<typeof create, Params>>(
    "/",
    { schema: schema, preHandler: preHandler },
    create
  );
}

export default index;
