import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../types";
import getKeys from "./get-keys";
import getProfiles from "./get-profiles";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.get<FromHandler<typeof getKeys>>("/keys", { ...getKeys }, getKeys);
  fastify.get<FromHandler<typeof getProfiles>>(
    "/profiles",
    { ...getProfiles },
    getProfiles
  );
}

export default index;
