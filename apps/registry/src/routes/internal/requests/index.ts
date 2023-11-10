import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../types";
import { read, schema } from "./read";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.get<FromHandler<typeof read>>("/", { schema }, read);
}

export default index;
