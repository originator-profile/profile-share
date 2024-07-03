import { FastifySchema, FastifyRequest } from "fastify";
import getKeys from "./account/_id/get-keys";
import { Jwks } from "@originator-profile/model";

const schema: FastifySchema = {
  operationId: "getIssuerJwtVc",
  tags: ["registry"],
  response: {
    200: {
      type: "object",
      properties: {
        issuer: { type: "string" },
        jwks: Jwks,
      },
      required: ["issuer", "jwks"],
      additionalProperties: false
    }
  }
};

async function getIssuerJwtVc(req: FastifyRequest) {
  const keysData = await getKeys(
    Object.assign(req, { params: { id: req.server.config.ISSUER_UUID } }),
  );
  const issuer = `${req.protocol}://${req.hostname}`;
  return {
    issuer: issuer,
    jwks: keysData,
  };
}

export default Object.assign(getIssuerJwtVc, { schema });
