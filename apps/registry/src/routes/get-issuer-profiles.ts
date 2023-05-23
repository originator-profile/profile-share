import { FastifySchema, FastifyRequest, FastifyReply } from "fastify";
import { JsonLdDocument } from "jsonld";
import getProfiles from "./website/_id/get-profiles";

const schema: FastifySchema = {
  operationId: "getIssuerProfiles",
  response: getProfiles.schema.response,
};

async function getIssuerProfiles(req: FastifyRequest, res: FastifyReply) {
  const data: JsonLdDocument | Error = await getProfiles(
    Object.assign(req, {
      params: {
        id: req.server.config.APP_URL ?? "http://localhost:8080",
      },
    }),
    res
  );
  return data;
}

export default Object.assign(getIssuerProfiles, { schema });
