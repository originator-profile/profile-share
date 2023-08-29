import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../types";
import { create, schema } from "./create";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.post<FromHandler<typeof create>>("/", { schema: schema }, create);
}

export default index;
