import { FastifySchema, FastifyRequest, FastifyReply } from "fastify";
import { HttpError, BadRequestError } from "http-errors-enhanced";
import { JsonLdDocument } from "jsonld";
import { ErrorResponse } from "../../../error";
import Params from "./params";

const schema: FastifySchema = {
  operationId: "getProfiles",
  params: Params,
  produces: ["application/ld+json"],
  response: {
    200: {
      title: "Originator Profile Document",
      type: "object",
      additionalProperties: true,
    },
    400: ErrorResponse,
    404: ErrorResponse,
  },
};

async function getProfiles(
  {
    server,
    params,
  }: FastifyRequest<{
    Params: Params;
  }>,
  reply: FastifyReply
) {
  const data: JsonLdDocument | Error =
    await server.services.account.getProfiles(params.id);
  if (data instanceof HttpError) return data;
  if (data instanceof Error) {
    return new BadRequestError("invalid params.id", data);
  }

  reply.type("application/ld+json");
  return data;
}

export default Object.assign(getProfiles, { schema });
