import { FastifyInstance } from "fastify";
import omit from "just-omit";
import { FromHandler } from "../../../../../types";
import Params from "./params";
import postDp from "./post-dp";
import { postSdp, schema } from "./post-dp";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.post<FromHandler<typeof postDp, Params>>(
    "/",
    { ...postDp },
    postSdp
  );
}

export default index;
