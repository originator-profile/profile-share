import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../types";
import { read, schema } from "./read";
import { preHandler } from "./hooks";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.get<FromHandler<typeof read>>(
    "/",
    { schema: schema, preHandler },
    read,
  );
}

export default index;
