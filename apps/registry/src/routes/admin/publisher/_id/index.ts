import { FastifyInstance } from "fastify";
import omit from "just-omit";
import { FromHandler } from "../../../../types";
import Params from "./params";
import website from "./website";
import issue from "./issue";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.post<FromHandler<typeof website, Params>>(
    "/",
    { ...website },
    website
  );
  fastify.get<FromHandler<typeof website, Params>>(
    "/",
    { schema: omit(website.schema, "body") },
    website
  );
  fastify.put<FromHandler<typeof website, Params>>(
    "/",
    { ...website },
    website
  );
  fastify.delete<FromHandler<typeof website, Params>>(
    "/",
    { schema: omit(website.schema, "body") },
    website
  );

  fastify.post<FromHandler<typeof issue, Params>>(
    "/issue",
    { ...issue },
    issue
  );
}

export default index;
