import { FastifySchema, FastifyRequest, FastifyReply } from "fastify";
import { JsonLdDocument } from "jsonld";
import getDocumentProfileSet from "./website/_id/get-document-profile-set";

const schema: FastifySchema = {
  operationId: "getFrontendProfileSet",
  response: getDocumentProfileSet.schema.response,
};

async function getFrontendProfileSet(req: FastifyRequest, res: FastifyReply) {
  const data: JsonLdDocument | Error = await getDocumentProfileSet(
    Object.assign(req, {
      params: {
        id: req.server.config.APP_URL ?? "http://localhost:8080",
      },
    }),
    res
  );
  return data;
}

export default Object.assign(getFrontendProfileSet, { schema });
