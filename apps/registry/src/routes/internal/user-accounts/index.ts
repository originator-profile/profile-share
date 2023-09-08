import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../types";
import { upsert, schema } from "./upsert";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.put<FromHandler<typeof upsert>>("/", { schema }, upsert);
}

export default index;
