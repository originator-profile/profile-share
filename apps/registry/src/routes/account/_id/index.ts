import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../types";
import Params from "./params";
import getKeys from "./get-keys";
import * as getSop from "./get-sop";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.get<FromHandler<typeof getKeys, Params>>(
    "/keys",
    { ...getKeys },
    getKeys,
  );
  fastify.route(getSop);
}

export default index;
