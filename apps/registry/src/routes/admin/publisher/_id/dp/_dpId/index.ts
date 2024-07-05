import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../../../types";
import Params from "./params";
import deleteDp from "./delete";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.delete<FromHandler<typeof deleteDp, Params>>(
    "/",
    { ...deleteDp },
    deleteDp,
  );
}

export default index;
