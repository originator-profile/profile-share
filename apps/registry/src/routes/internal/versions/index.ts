import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../types";
import { get, schema } from "./get";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.get<FromHandler<typeof get>>("/", { schema: schema }, get);
}

export default index;
