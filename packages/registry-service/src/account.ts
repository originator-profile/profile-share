import { Prisma, accounts } from "@prisma/client";
import { ContextDefinition, JsonLdDocument } from "jsonld";
import { fromUnixTime } from "date-fns";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";
import { Jwk, Jwks } from "@originator-profile/model";
import { isJwtOpPayload } from "@originator-profile/core";
import { ValidatorService } from "./validator";
import { getClient } from "@originator-profile/registry-db";

type Options = {
  validator: ValidatorService;
};

type AccountId = string;
type OpId = string;

export const AccountService = ({ validator }: Options) => ({
  /**
   * 会員の作成
   * @param input 会員
   * @return 会員
   */
  async create({
    id: _,
    ...input
  }: Prisma.accountsCreateInput): Promise<accounts | Error> {
    const prisma = getClient();
    return await prisma.accounts.create({ data: input }).catch((e: Error) => e);
  },
  /**
   * 会員の表示
   * @param input.id 会員 ID
   * @return 会員
   */
  async read({ id }: { id: AccountId }): Promise<accounts | Error> {
    const prisma = getClient();
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
  async update({
    id,
    ...input
  }: Prisma.accountsUpdateInput & { id: AccountId }): Promise<
    accounts | Error
  > {
    const prisma = getClient();
    return await prisma.accounts.update({
      where: { id },
      data: input,
    });
  },
  /**
   * 会員の削除
   * @param input.id 会員 ID
   * @return 会員
   */
  async delete({ id }: { id: AccountId }): Promise<accounts | Error> {
    const prisma = getClient();
    return await prisma.accounts.delete({
      where: { id },
    });
  },
  /**
   * JWKS の取得
   * @param id 会員 ID
   */
  async getKeys(id: AccountId): Promise<Jwks | Error> {
    const prisma = getClient();
    const data = await prisma.keys
      .findMany({ where: { accountId: id } })
      .catch((e: Error) => e);
    if (!data) return new NotFoundError();
    if (data instanceof Error) return data;

    const jwks: Jwks = { keys: data.map((key) => key.jwk as Jwk) };
    return jwks;
  },
  /**
   * 公開鍵の登録
   * @param id 会員 ID
   * @param input 公開鍵 (JWK)
   */
  async registerKey(id: AccountId, input: Jwk): Promise<Jwks | Error> {
    const prisma = getClient();
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
   * Signed Originator Profile の登録 (Document Profile Registry 用)
   * @param id 会員 ID
   * @param jwt Signed Originator Profile
   * @return 成功した場合はSigned Originator Profile、失敗した場合はError
   */
  async registerOp(id: AccountId, jwt: string): Promise<string | Error> {
    const prisma = getClient();
    const account = await this.read({ id });
    if (account instanceof Error) return account;
    const uuid = account.id;
    const decoded = validator.decodeToken(jwt);
    if (decoded instanceof Error) return decoded;
    if (!isJwtOpPayload(decoded.payload)) {
      return new BadRequestError("It is not Originator Profile.");
    }
    if (decoded.payload.sub !== account.domainName) {
      return new BadRequestError(
        "It is not Signed Originator Profile for the account.",
      );
    }
    const issuedAt: Date = fromUnixTime(decoded.payload.iat);
    const expiredAt: Date = fromUnixTime(decoded.payload.exp);
    const op = await prisma.ops
      .create({
        data: {
          certifierId: uuid,
          jwt,
          issuedAt,
          expiredAt,
        },
      })
      .catch((e: Error) => e);
    if (!op) return new BadRequestError();
    if (op instanceof Error) return op;
    const pub = await this.publishProfile(uuid, op.id);
    if (!pub) return new BadRequestError();
    if (pub instanceof Error) return pub;
    return jwt;
  },
  /**
   * OP の公開
   * @param id 会員 ID
   * @param opId OP ID
   * @return 公開した OP (JWT)
   */
  async publishProfile(id: AccountId, opId: OpId): Promise<string | Error> {
    const prisma = getClient();
    const data = await prisma.publications
      .create({ data: { accountId: id, opId }, include: { op: true } })
      .catch((e: Error) => e);
    if (!data) return new BadRequestError();
    if (data instanceof Error) return data;

    const jwt = data.op.jwt;
    return jwt;
  },
  /**
   * Profile Set の取得
   * @param id 会員 ID
   * @param contextDefinition https://www.w3.org/TR/json-ld11/#context-definitions
   */
  async getProfileSet(
    id: string,
    contextDefinition:
      | ContextDefinition
      | string = "https://originator-profile.org/context.jsonld",
  ): Promise<JsonLdDocument | Error> {
    const prisma = getClient();
    const data = await prisma.accounts
      .findUnique({
        where: { id },
        include: {
          publications: {
            include: {
              op: true,
            },
            orderBy: {
              publishedAt: "desc",
            },
            take: 1,
          },
        },
      })
      .catch((e: Error) => e);
    if (!data) return new NotFoundError();
    if (data instanceof Error) return data;
    if (data.publications.length === 0) return new NotFoundError();

    const ops = data.publications.map((publication) => publication.op);
    const profiles: JsonLdDocument = {
      "@context": contextDefinition,
      profile: ops.map((p) => p.jwt),
    };
    return profiles;
  },
});

export type AccountService = ReturnType<typeof AccountService>;
