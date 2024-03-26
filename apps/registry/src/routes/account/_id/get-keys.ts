import { FastifySchema, FastifyRequest } from "fastify";
import { HttpError, BadRequestError } from "http-errors-enhanced";
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
  const data: Jwks | Error = await server.services.account.getKeys(params.id);
  if (data instanceof HttpError) return data;
  if (data instanceof Error) {
    return new BadRequestError("invalid params.id", data);
  }
  return data;
}

export default Object.assign(getKeys, { schema });
