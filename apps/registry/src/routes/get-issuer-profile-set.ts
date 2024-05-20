import { FastifySchema, FastifyRequest, FastifyReply } from "fastify";
import { JsonLdDocument } from "jsonld";
import getProfileSet from "./account/_id/get-profile-set";

const schema: FastifySchema = {
  operationId: "getIssuerProfileSet",
  tags: ["registry"],
  produces: ["application/ld+json"],
  response: getProfileSet.schema.response,
};

async function getIssuerProfileSet(req: FastifyRequest, res: FastifyReply) {
  const data: JsonLdDocument = await getProfileSet(
    Object.assign(req, {
      params: {
        id: req.server.config.ISSUER_UUID,
      },
    }),
    res,
  );
  return data;
}

export default Object.assign(getIssuerProfileSet, { schema });
