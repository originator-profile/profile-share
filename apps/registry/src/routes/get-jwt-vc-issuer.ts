import { FastifySchema, FastifyRequest } from "fastify";
import getKeys from "./account/_id/get-keys";
import { Jwks } from "@originator-profile/model";

const schema: FastifySchema = {
  operationId: "getJwtVcIssuer",
  tags: ["registry"],
  summary: "OPレジストリ JWT VC Issuer Metadata の取得",
  response: {
    200: {
      type: "object",
      properties: {
        issuer: { type: "string" },
        jwks: Jwks,
      },
      required: ["issuer", "jwks"],
      additionalProperties: false,
      examples: [
        {
          issuer: "https://example.com",
          jwks: {
            keys: [
              {
                kty: "EC",
                kid: "jJYs5_ILgUc8180L-pBPxBpgA3QC7eZu9wKOkh9mYPU",
                x: "ypAlUjo5O5soUNHk3mlRyfw6ujxqjfD_HMQt7XH-rSg",
                y: "1cmv9lmZvL0XAERNxvrT2kZkC4Uwu5i1Or1O-4ixJuE",
                crv: "P-256",
              },
            ],
          },
        },
      ],
    },
  },
};

async function getJwtVcIssuer(req: FastifyRequest) {
  const keysData = await getKeys(
    Object.assign(req, { params: { id: req.server.config.ISSUER_UUID } }),
  );

  const issuer = (req.server.config.APP_URL || "http://localhost:8080").replace(
    /\/$/,
    "",
  );

  return {
    issuer: issuer,
    jwks: keysData,
  };
}

export default Object.assign(getJwtVcIssuer, { schema });
