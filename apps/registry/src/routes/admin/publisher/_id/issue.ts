import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { BadRequestError } from "http-errors-enhanced";
import { ErrorResponse } from "../../../../error";
import Params from "./params";

const Body = {
  type: "object",
  properties: {
    jwt: {
      description: "DP (JWT)",
      type: "string",
    },
  },
  required: ["url", "jwt"],
} as const;

type Body = FromSchema<typeof Body>;

const schema: FastifySchema = {
  params: Params,
  body: Body,
  description: "DP の登録",
  security: [{ basicAuth: [] }],
  response: {
    200: { description: "ok", type: "string" },
    400: ErrorResponse,
  },
};

async function issue({
  server,
  params,
  body,
}: FastifyRequest<{
  Params: Params;
  Body: Body;
}>) {
  const dpId = await server.services.publisher.issueDp(params.id, body.jwt);
  if (dpId instanceof Error) {
    throw new BadRequestError("Invalid issue request");
  }
  return "ok";
}

export default Object.assign(issue, { schema });
