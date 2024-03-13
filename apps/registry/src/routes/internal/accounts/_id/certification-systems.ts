import { FastifySchema, FastifyRequest } from "fastify";
import { CertificationSystem } from "@originator-profile/model";
import Params from "./params";

export const method = "GET";
export const url = "/certification-systems";

export const schema = {
  operationId: "account.getCertificationSystems",
  params: Params,
  description: "利用可能な認証制度の一覧の取得",
  security: [{ bearerAuth: ["write:requests"] }],
  response: {
    200: {
      title: "認証制度の一覧",
      type: "array",
      items: CertificationSystem,
    },
  },
} as const satisfies FastifySchema;

export async function handler(
  req: FastifyRequest<{ Params: Params }>,
): Promise<Array<CertificationSystem>> {
  const data = await req.server.services.account.read(req.params);

  if (data instanceof Error) throw data;

  return await req.server.services.certificationSystemRepository.all({
    selfDeclaration: {
      names: [
        "JICDAQ ブランドセーフティ認証",
        "JICDAQ 無効トラフィック対策認証",
      ],
      verifier: data,
    },
  });
}
