import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../../types";
import { read, schema as schemaRead } from "./read";
import { create, schema } from "./create";
import Params from "../params";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.get<FromHandler<typeof read, Params>>(
    "/",
    { schema: schemaRead },
    read,
  );
  fastify.post<FromHandler<typeof create, Params>>("/", { schema }, create);
}

export default index;
