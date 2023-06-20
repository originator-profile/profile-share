import { FastifyInstance } from "fastify";
import omit from "just-omit";
import { FromHandler } from "../../types";
import getProfiles from "./get-profile-set";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.post<FromHandler<typeof getProfiles>>(
    "/profiles",
    { schema: omit(getProfiles.schema, "querystring") },
    getProfiles
  );

  fastify.get<FromHandler<typeof getProfiles>>(
    "/profiles",
    { schema: omit(getProfiles.schema, "body") },
    getProfiles
  );
}

export default index;
