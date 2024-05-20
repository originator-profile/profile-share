import { FastifySchema, FastifyRequest } from "fastify";
import getKeys from "./account/_id/get-keys";

const schema: FastifySchema = {
  operationId: "getIssuerKeys",
  tags: ["registry"],
  response: getKeys.schema.response,
};

async function getIssuerKeys(req: FastifyRequest) {
  const data = await getKeys(
    Object.assign(req, { params: { id: req.server.config.ISSUER_UUID } }),
  );
  return data;
}

export default Object.assign(getIssuerKeys, { schema });
