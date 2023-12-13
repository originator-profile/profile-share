import { FastifyInstance } from "fastify";
import * as getProfilePair from "./get-profile-pair";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.route(getProfilePair);
}

export default index;
