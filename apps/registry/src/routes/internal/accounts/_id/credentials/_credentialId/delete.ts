import { FastifySchema, FastifyRequest } from "fastify";
import Params from "./params";

const schema: FastifySchema = {
  params: Params,
  tags: ["credentials"],
  description: "資格情報の削除",
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: {
      description: "削除した資格情報",
      type: "object",
      additionalProperties: true,
    },
  },
};

async function deleteOne({
  server,
  params,
}: FastifyRequest<{
  Body: Body;
  Params: Params;
}>) {
  const { id, credentialId } = params;
  return await server.services.credential.delete(credentialId, id);
}

export { deleteOne, schema };
