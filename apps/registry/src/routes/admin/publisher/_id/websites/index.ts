import { FastifyInstance } from "fastify";
import { FromHandler } from "../../../../../types";
import Params from "./params";
import postSdp from "./post-sdp";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.post<FromHandler<typeof postSdp, Params>>(
    "/",
    { ...postSdp },
    postSdp
  );
}

export default index;
