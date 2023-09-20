import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../../types";
import { create, schema } from "./create";
import Params from "../params";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.post<FromHandler<typeof create, Params>>(
    "/",
    { schema: schema },
    create,
  );
}

export default index;
