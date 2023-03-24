import { PrismaClient, Prisma, accounts } from "@prisma/client";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";
import { Jwk, Jwks } from "@webdino/profile-model";
import { ValidatorService } from "./validator";

type Options = {
  prisma: PrismaClient;
  validator: ValidatorService;
};

type AccountId = string;
type OpId = string;

/**
 * UUID文字列形式の判定
 * @param id 会員 ID またはドメイン名
 * @return UUID文字列形式の場合はtrue、それ以外の場合false
 */
function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id
  );
}

export const AccountService = ({ prisma, validator }: Options) => ({
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
   * @param input.id 会員 ID またはドメイン名
   * @return 会員
   */
  async read({ id }: { id: AccountId }): Promise<accounts | Error> {
    const data = await prisma.accounts
      .findUnique({ where: isUuid(id) ? { id } : { domainName: id } })
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
   * @param input.id 会員 ID またはドメイン名
   * @return 会員
   */
  async delete({ id }: { id: AccountId }): Promise<accounts | Error> {
    return await prisma.accounts.delete({
      where: isUuid(id) ? { id } : { domainName: id },
    });
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
