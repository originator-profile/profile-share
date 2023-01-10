import { PrismaClient, Prisma, accounts } from "@prisma/client";
import { JsonLdDocument } from "jsonld";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";
import { Jwk, Jwks } from "@webdino/profile-model";
import Config from "./config";
import { ValidatorService } from "./validator";

type Options = {
  config: Config;
  prisma: PrismaClient;
  validator: ValidatorService;
};

type AccountId = string;
type OpId = string;

export const AccountService = ({ config, prisma, validator }: Options) => ({
  /**
   * 会員の作成
   * @param input 会員
   * @return 会員
   */
  async create(input: Prisma.accountsCreateInput): Promise<accounts | Error> {
    return await prisma.accounts.create({ data: input }).catch((e: Error) => e);
  },
  /**
   * 会員の表示
   * @param input.id 会員 ID
   * @return 会員
   */
  async read({ id }: { id: AccountId }): Promise<accounts | Error> {
    const data = await prisma.accounts
      .findUnique({ where: { id } })
      .catch((e: Error) => e);
    return data ?? new NotFoundError();
  },
  /**
   * 会員の更新
   * @param input 会員
   * @return 会員
   */
  async update(
    input: Prisma.accountsUpdateInput & { id: AccountId }
  ): Promise<accounts | Error> {
    return await prisma.accounts.update({
      where: { id: input.id },
      data: input,
    });
  },
  /**
   * 会員の削除
   * @param input.id 会員 ID
   * @return 会員
   */
  async delete({ id }: { id: AccountId }): Promise<accounts | Error> {
    return await prisma.accounts.delete({ where: { id } });
  },
  /**
   * JWKS の取得
   * @param id 会員 ID
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
   * Profiles Set の取得
   * @deprecated
   * @param id 会員 ID
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
      "@context": `${
        config.APP_URL ?? Config.properties.APP_URL.default
      }/context`,
      main: data.map((publication) => publication.account.url),
      profile: ops.map((op) => op.jwt),
    };
    return profiles;
  },
  /**
   * 公開鍵の登録
   * @param id 会員 ID
   * @param input 公開鍵 (JWK)
   */
  async registerKey(id: AccountId, input: Jwk): Promise<Jwks | Error> {
    const jwk = validator.jwkValidate(input);
    if (jwk instanceof Error) return jwk;
    const data = await prisma.keys
      .create({ data: { accountId: id, jwk: jwk as Prisma.InputJsonValue } })
      .catch((e: Error) => e);
    if (!data) return new BadRequestError();
    if (data instanceof Error) return data;

    const jwks: Jwks = { keys: [data.jwk as Jwk] };
    return jwks;
  },
  /**
   * OP の公開
   * @param id 会員 ID
   * @param opId OP ID
   * @return 公開した OP (JWT)
   */
  async publishProfile(id: AccountId, opId: OpId): Promise<string | Error> {
    const data = await prisma.publications
      .create({ data: { accountId: id, opId }, include: { op: true } })
      .catch((e: Error) => e);
    if (!data) return new BadRequestError();
    if (data instanceof Error) return data;

    const jwt = data.op.jwt;
    return jwt;
  },
});

export type AccountService = ReturnType<typeof AccountService>;
