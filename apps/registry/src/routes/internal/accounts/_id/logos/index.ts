import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../../types";
import { upsert, schema } from "./upsert";
import Params from "./params";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.put<FromHandler<typeof upsert, Params>>(
    "/",
    { schema: schema },
    upsert,
  );
}

export default index;
