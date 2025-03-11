import { Jwk, Jwks, type OpHolder } from "@originator-profile/model";
import { beginTransaction, getClient } from "@originator-profile/registry-db";
import { Prisma, accounts } from "@prisma/client";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";
import { ContextDefinition, JsonLdDocument } from "jsonld";
import { ValidatorService } from "./validator";

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
  }: Prisma.accountsCreateInput): Promise<accounts> {
    const prisma = getClient();
    return await prisma.accounts.create({ data: input });
  },
  /**
   * 会員の表示
   * @param input.id 会員 ID
   * @throws {NotFoundError} 組織情報が見つからない
   * @return 会員
   */
  async read({
    id,
  }: {
    id: AccountId;
  }): Promise<accounts & { businessCategory?: string[] }> {
    const prisma = getClient();
    const data = await prisma.accounts.findUnique({
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
    });

    if (!data) {
      throw new NotFoundError("OP Account not found.");
    }

    if ("businessCategories" in data) {
      const businessCategories = data.businessCategories.map(
        (cat) => cat.businessCategoryValue,
      );

      const { businessCategories: _, ...omitBusinessCategories } = data;
      return {
        ...omitBusinessCategories,
        businessCategory: businessCategories,
      };
    }

    return data;
  },
  /**
   * 会員の更新
   * @param input 会員
   * @return 会員
   */
  async update({
    id,
    businessCategory,
    ...input
  }: Omit<Partial<OpHolder>, "logos" | "type"> & {
    id: string;
  }): Promise<accounts> {
    const prisma = getClient();
    await this.raiseIfDomainNameCannotChange(id, input.domainName);

    return await beginTransaction(async () => {
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
    });
  },
  /**
   * 会員の削除
   * @param input.id 会員 ID
   * @return 会員
   */
  async delete({ id }: { id: AccountId }): Promise<accounts> {
    const prisma = getClient();
    return await prisma.accounts.delete({
      where: { id },
    });
  },
  /**
   * JWKS の取得
   * @param id 会員 ID
   */
  async getKeys(id: AccountId): Promise<Jwks> {
    const prisma = getClient();
    const data = await prisma.keys.findMany({ where: { accountId: id } });
    const jwks: Jwks = { keys: data.map((key) => key.jwk as Jwk) };
    return jwks;
  },
  /**
   * Signed Originator Profile の取得
   * @param id 会員 ID
   * @throws {NotFoundError} 組織情報が見つからない/SOP が見つからない
   * @return Signed Originator Profile
   */
  async getSop(id: AccountId): Promise<string> {
    const prisma = getClient();
    const data = await prisma.accounts.findUnique({
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
    });
    if (!data) {
      throw new NotFoundError("OP Account not found.");
    }
    if (data.publications.length === 0) {
      throw new NotFoundError("Signed Originator Profile not found.");
    }
    return data.publications[0].op.jwt;
  },
  /**
   * 公開鍵の登録
   * @param id 会員 ID
   * @param input 公開鍵 (JWK)
   * @throws {BadRequestError} 公開鍵ではなくプライベート鍵を登録しようとしている
   */
  async registerKey(id: AccountId, input: Jwk): Promise<Jwks> {
    const prisma = getClient();
    const jwk = validator.jwkValidate(input);

    if (jwk.d) throw new BadRequestError("Private key not allowed.");

    const data = await prisma.keys.create({
      data: { accountId: id, jwk: jwk as Prisma.InputJsonValue },
    });

    const jwks: Jwks = { keys: [data.jwk as Jwk] };
    return jwks;
  },
  /**
   * 公開鍵の削除
   * @param id 会員 ID
   * @param kid Key ID
   * @return Key ID
   */
  async destroyKey(id: AccountId, kid: string): Promise<string> {
    const prisma = getClient();
    await prisma.keys.delete({
      where: { accountId: id, id: kid },
    });
    return kid;
  },
  /**
   * OP の公開
   * @param id 会員 ID
   * @param opId OP ID
   * @return 公開した OP (JWT)
   */
  async publishProfile(id: AccountId, opId: OpId): Promise<string> {
    const prisma = getClient();
    const data = await prisma.publications.create({
      data: { accountId: id, opId },
      include: { op: true },
    });

    const jwt = data.op.jwt;
    return jwt;
  },
  /**
   * Profile Set の取得
   * @param id 会員 ID
   * @param contextDefinition https://www.w3.org/TR/json-ld11/#context-definitions
   * @throws {NotFoundError} 組織情報が見つからない
   */
  async getProfileSet(
    id: string,
    contextDefinition:
      | ContextDefinition
      | string = "https://originator-profile.org/context.jsonld",
  ): Promise<JsonLdDocument> {
    const prisma = getClient();
    const data = await prisma.accounts.findUnique({
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
    });

    if (!data) {
      throw new NotFoundError("OP Account not found.");
    }
    if (data.publications.length === 0) {
      throw new NotFoundError("Signed Originator Profile not found.");
    }

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
   * @throws {NotFoundError} 組織情報が見つからない
   */
  async raiseIfDomainNameCannotChange(
    id: string,
    newDomainName?: string,
  ): Promise<void> {
    if (!newDomainName) {
      return;
    }
    const prisma = getClient();
    const result = await prisma.accounts.findFirst({
      where: { id },
      include: { issuedOps: true },
    });
    if (!result) {
      throw new NotFoundError("OP Account not found");
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
