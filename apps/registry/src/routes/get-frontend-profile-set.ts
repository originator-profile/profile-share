import { FastifySchema, FastifyRequest, FastifyReply } from "fastify";
import { JsonLdDocument } from "jsonld";
import getProfileSet from "./website/get-profile-set";

const schema: FastifySchema = {
  operationId: "getFrontendProfileSet",
  tags: ["registry"],
  response: getProfileSet.schema.response,
};

async function getFrontendProfileSet(req: FastifyRequest, res: FastifyReply) {
  const data: JsonLdDocument = await getProfileSet(
    Object.assign(req, {
      query: {
        url: req.server.config.APP_URL ?? "http://localhost:8080/",
      },
    }),
    res,
  );
  return data;
}

export default Object.assign(getFrontendProfileSet, { schema });
