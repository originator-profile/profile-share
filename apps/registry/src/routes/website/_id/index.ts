import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../types";
import Params from "./params";
import getProfiles from "./get-profiles";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.get<FromHandler<typeof getProfiles, Params>>(
    "/profiles",
    { ...getProfiles },
    getProfiles
  );
}

export default index;
