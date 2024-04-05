import { FastifySchema, FastifyRequest } from "fastify";
import { Jwks } from "@originator-profile/model";
import Params from "./params";

const schema: FastifySchema = {
  operationId: "getKeys",
  params: Params,
  response: {
    200: Jwks,
  },
};

async function getKeys({
  server,
  params,
}: FastifyRequest<{
  Params: Params;
}>) {
  return await server.services.account.getKeys(params.id);
}

export default Object.assign(getKeys, { schema });
