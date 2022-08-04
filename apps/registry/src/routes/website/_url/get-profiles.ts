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
      title: "Profiles Set",
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
  // TODO: Profiles Set は、Signed Originator Profile, Signed Document Profile を含むが、publisher, advertiser については仕様を満たしていない。
  const data: JsonLdDocument | Error =
    await server.services.website.getProfiles(params.url);
  if (data instanceof HttpError) return data;
  if (data instanceof Error) {
    return new BadRequestError("invalid params.url", data);
  }

  reply.type("application/ld+json");
  return data;
}

export default Object.assign(getProfiles, { schema });
