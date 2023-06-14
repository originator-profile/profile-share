import { FastifyInstance } from "fastify";
import { FromHandler } from "../../types";
import Params from "./params";
import getProfiles from "./get-profile-set";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.post<FromHandler<typeof getProfiles, Params>>(
    "/profiles",
    { ...getProfiles },
    getProfiles
  );
}

export default index;
