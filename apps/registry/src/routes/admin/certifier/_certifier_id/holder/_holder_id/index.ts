import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../../../types";
import Params from "./params";
import issue from "./issue";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.post<FromHandler<typeof issue, Params>>(
    "/issue",
    { ...issue },
    issue
  );
}

export default index;
