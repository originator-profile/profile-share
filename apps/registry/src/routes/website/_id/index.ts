import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../types";
import Params from "./params";
import getProfiles from "./get-document-profile-set";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.get<FromHandler<typeof getProfiles, Params>>(
    "/profiles",
    { ...getProfiles },
    getProfiles
  );
}

export default index;
