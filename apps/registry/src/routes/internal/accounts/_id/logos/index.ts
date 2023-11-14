import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../../types";
import { read, schema as schemaRead } from "./read";
import { upsert, schema } from "./upsert";
import Params from "./params";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.get<FromHandler<typeof read, Params>>(
    "/",
    { schema: schemaRead },
    read,
  );
  fastify.put<FromHandler<typeof upsert, Params>>(
    "/",
    { schema: schema, bodyLimit: 10485760 },
    upsert,
  );
}

export default index;
