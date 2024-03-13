import { Prisma, accounts } from "@prisma/client";
import { ContextDefinition, JsonLdDocument } from "jsonld";
import { fromUnixTime } from "date-fns";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";
import { Jwk, Jwks, type OpHolder } from "@originator-profile/model";
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
  async read({
    id,
  }: {
    id: AccountId;
  }): Promise<(accounts & { businessCategory?: string[] }) | Error> {
    const prisma = getClient();
    const data = await prisma.accounts
      .findUnique({
        where: { id },
        include: {
          businessCategories: true,
          credentials: {
            include: {
              certifier: { select: { id: true, domainName: true, name: true } },
              verifier: { select: { id: true, domainName: true, name: true } },
            },
          },
        },
      })
      .catch((e: Error) => e);
    if (data && "businessCategories" in data) {
      const businessCategories = data.businessCategories.map(
        (cat) => cat.businessCategoryValue,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { businessCategories: _, ...omitBusinessCategories } = data;
      return {
        ...omitBusinessCategories,
        businessCategory: businessCategories,
      };
    }
    return data ?? new NotFoundError();
  },
  /**
   * 会員の更新
   * @param input 会員
   * @return 会員
   */
  async updateAccount({
    id,
    businessCategory,
    ...input
  }: Omit<Partial<OpHolder>, "logos" | "type"> & {
    id: string;
  }): Promise<accounts | Error> {
    const prisma = getClient();
    await this.raiseIfDomainNameCannotChange(id, input.domainName);
    if (businessCategory) {
      // businessCategory は、複数値としてモデルで定義されているが、
      // 単一値しか取らないと思われるので、配列の最初の要素だけを取り出す。
      const businessCategoryValue = businessCategory[0];
      await prisma.businessCategories.upsert({
        where: { value: businessCategoryValue },
        update: { value: businessCategoryValue },
        create: { value: businessCategoryValue },
      });

      await prisma.accountBusinessCategories.deleteMany({
        where: { accountId: id },
      });

      await prisma.accountBusinessCategories.create({
        data: {
          accountId: id,
          businessCategoryValue: businessCategoryValue,
        },
      });
    }

    return await prisma.accounts.update({
      where: { id },
      data: input,
    });
  },
  /**
   * 会員の更新
   * @param input 会員
   * @return 会員
   *
   * @deprecated 代わりに {@link updateAccount} を利用してください。
   */
  async update({
    id,
    ...input
  }: Prisma.accountsUpdateInput & { id: AccountId }): Promise<
    accounts | Error
  > {
    const prisma = getClient();
    if (input.domainName) {
      const newDomainName =
        typeof input.domainName === "string"
          ? input.domainName
          : input.domainName.set;
      this.raiseIfDomainNameCannotChange(id, newDomainName);
    }
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
    if (jwk.d) return new BadRequestError("Private key not allowed.");
    const data = await prisma.keys
      .create({ data: { accountId: id, jwk: jwk as Prisma.InputJsonValue } })
      .catch((e: Error) => e);
    if (!data) return new BadRequestError();
    if (data instanceof Error) return data;

    const jwks: Jwks = { keys: [data.jwk as Jwk] };
    return jwks;
  },
  /**
   * 公開鍵の削除
   * @param id 会員 ID
   * @param kid Key ID
   * @return 成功した場合: Key ID, 失敗した場合: Error
   */
  async destroyKey(id: AccountId, kid: string): Promise<string | Error> {
    const prisma = getClient();
    const data = await prisma.keys
      .delete({ where: { accountId: id, id: kid } })
      .catch((e: Error) => e);
    if (data instanceof Error) return data;
    return kid;
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
  /**
   * ドメイン名（と会員 ID）が変更不可能なら例外を投げる。
   * @param id 会員ID
   * @param newDomainName 変更後のドメイン名
   */
  async raiseIfDomainNameCannotChange(id: string, newDomainName?: string) {
    if (!newDomainName) {
      return;
    }
    const prisma = getClient();
    const result = await prisma.accounts.findFirst({
      where: { id },
      include: { issuedOps: true },
    });
    if (!result) {
      throw new NotFoundError("Account not found");
    } else {
      const willIdChange = result.domainName !== newDomainName;
      const opsIssued = result?.issuedOps && result?.issuedOps.length > 0;
      if (willIdChange && opsIssued) {
        throw new BadRequestError("Cannot change OP ID");
      }
    }
  },
});

export type AccountService = ReturnType<typeof AccountService>;
