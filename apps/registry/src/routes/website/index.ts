import { FastifyInstance } from "fastify";
import { FromHandler } from "../../types";
import getProfiles from "./get-profile-set";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.get<FromHandler<typeof getProfiles>>(
    "/profiles",
    { ...getProfiles },
    getProfiles
  );
}

export default index;
