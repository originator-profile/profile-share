import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { BadRequestError } from "http-errors-enhanced";
import { ErrorResponse } from "../../../../../error";
import Params from "../params";
import { Request } from "@originator-profile/model";
import { convertToModel } from "@originator-profile/registry-db";

const Body = {
  type: "object",
  properties: {
    requestSummary: Request.properties.requestSummary,
  },
  required: ["requestSummary"],
} as const;

type Body = FromSchema<typeof Body>;

const schema: FastifySchema = {
  body: Body,
  params: Params,
  description: "申請情報の登録",
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: {
      title: "申請",
      type: "object",
      additionalProperties: true,
    },
    400: ErrorResponse,
  },
};

async function create(
  req: FastifyRequest<{
    Body: Body;
    Params: Params;
  }>,
) {
  const { id } = req.params;
  const authorId = req.user.sub;
  const { requestSummary } = req.body;

  const result = await req.server.services.request.create(
    id,
    authorId,
    requestSummary,
  );

  if (result instanceof Error) return new BadRequestError("Invalid request");
  return convertToModel(result);
}

export { create, schema };
