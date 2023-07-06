import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../../types";
import Params from "./params";
import postDp from "./post-dp";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.post<FromHandler<typeof postDp, Params>>("/", { ...postDp }, postDp);
}

export default index;
