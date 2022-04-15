import { FastifySchema, FastifyRequest, FastifyReply } from "fastify";
import { JsonLdDocument } from "jsonld";
import getProfiles from "./account/_id/get-profiles";

const schema: FastifySchema = {
  operationId: "getIssuerProfiles",
  response: getProfiles.schema.response,
};

async function getIssuerProfiles(req: FastifyRequest, res: FastifyReply) {
  const data: JsonLdDocument | Error = await getProfiles(
    Object.assign(req, {
      params: { id: req.server.config.ISSUER_UUID },
    }),
    res
  );
  return data;
}

export default Object.assign(getIssuerProfiles, { schema });
