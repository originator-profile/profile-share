import { PrismaClient } from "@prisma/client";
import { JsonLdDocument } from "jsonld";
import { NotFoundError } from "http-errors-enhanced";
import Jwk from "@webdino/profile-model/src/jwk";
import Jwks from "@webdino/profile-model/src/jwks";
import Config from "./config";

type Options = {
  config: Config;
  prisma: PrismaClient;
};

type AccountId = string;

export const AccountService = ({ config, prisma }: Options) => ({
  /**
   * JWKS の取得
   * @param {AccountId} id
   */
  async getKeys(id: AccountId): Promise<Jwks | Error> {
    const data = await prisma.keys
      .findMany({ where: { accountId: id } })
      .catch((e: Error) => e);
    if (!data) return new NotFoundError();
    if (data instanceof Error) return data;

    const jwks: Jwks = { keys: data.map((key) => key.jwk as Jwk) };
    return jwks;
  },
  /**
   * Originator Profile Document の取得
   * @param {AccountId} id
   */
  async getProfiles(id: AccountId): Promise<JsonLdDocument | Error> {
    const data = await prisma.accounts
      .findUnique({ where: { id } })
      .publications({ include: { op: true, account: true } })
      .catch((e: Error) => e);
    if (!data) return new NotFoundError();
    if (data instanceof Error) return data;

    const ops = data.map((publication) => publication.op);
    const profiles: JsonLdDocument = {
      "@context": config.JSONLD_CONTEXT,
      main: data.map((publication) => publication.account.url),
      profiles: ops.map((op) => op.jwt),
    };
    return profiles;
  },
});

export type AccountService = ReturnType<typeof AccountService>;
