import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../types";
import { update, schema, preHandler } from "./update";
import Params from "./params";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.put<FromHandler<typeof update, Params>>(
    "/",
    { schema, preHandler},
    update,
  );
}

export default index;
