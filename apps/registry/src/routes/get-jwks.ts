import { Jwks } from "@originator-profile/model";
import { FastifyRequest, FastifySchema } from "fastify";

export const method = "GET";
export const url = "/.well-known/jwks.json";

export const schema = {
  operationId: "getJwks",
  tags: ["registry"],
  summary: "OP レジストリ JWKS 取得",
  response: {
    200: {
      ...Jwks,
      examples: [
        {
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
      ],
    },
  },
} as const satisfies FastifySchema;

export async function handler(req: FastifyRequest) {
  return await req.server.services.account.getKeys(
    req.server.config.ISSUER_UUID as string,
  );
}
