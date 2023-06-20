import { FastifySchema, FastifyRequest, FastifyReply } from "fastify";
import { JsonLdDocument } from "jsonld";
import getProfileSet from "./website/get-profile-set";
import { FromHandler } from "../types";

const schema: FastifySchema = {
  operationId: "getFrontendProfileSet",
  response: getProfileSet.schema.response,
};

async function getFrontendProfileSet(req: FastifyRequest, res: FastifyReply) {
  const data: JsonLdDocument | Error = await getProfileSet(
    Object.assign(req as FastifyRequest<FromHandler<typeof getProfileSet>>, {
      body: {
        url: req.server.config.APP_URL ?? "http://localhost:8080",
      },
    }),
    res
  );
  return data;
}

export default Object.assign(getFrontendProfileSet, { schema });
