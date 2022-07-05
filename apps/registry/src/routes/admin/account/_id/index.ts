import { FastifyInstance } from "fastify";
import omit from "just-omit";
import { FromHandler } from "../../../../types";
import Params from "./params";
import account from "./account";

async function index(fastify: FastifyInstance): Promise<void> {
  fastify.post<FromHandler<typeof account, Params>>(
    "/",
    { ...account },
    account
  );
  fastify.get<FromHandler<typeof account, Params>>(
    "/",
    { schema: omit(account.schema, "body") },
    account
  );
  fastify.put<FromHandler<typeof account, Params>>(
    "/",
    { ...account },
    account
  );
  fastify.delete<FromHandler<typeof account, Params>>(
    "/",
    { schema: omit(account.schema, "body") },
    account
  );
}

export default index;
