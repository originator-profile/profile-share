import { FastifySchema, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import Params from "./params";

const Body = {
  type: "object",
  properties: {
    jwt: {
      description: "OP (JWT)",
      type: "string",
    },
  },
  required: ["jwt"],
} as const;

type Body = FromSchema<typeof Body>;

const schema: FastifySchema = {
  params: Params,
  body: Body,
  description: "OP の登録",
  security: [{ basicAuth: [] }],
  response: {
    200: { description: "ok", type: "string" },
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
  const opId = await server.services.certificate.issue(
    params.certifier_id,
    body.jwt,
  );

  await server.services.account.publishProfile(params.holder_id, opId);

  return "ok";
}

export default Object.assign(issue, { schema });
