import { FastifyRequest, FastifySchema } from "fastify";
import { CertificationSystem } from "@originator-profile/model";
import Params from "./params";

export const method = "GET";
export const url = "";

export const schema = {
  operationId: "certificationSystems.getCertificationSystem",
  description: "認証制度の取得",
  params: Params,
  response: {
    200: CertificationSystem,
  },
} satisfies FastifySchema;

export async function handler(req: FastifyRequest<{ Params: Params }>) {
  return await req.server.services.certificationSystemRepository.read(
    req.params,
  );
}
