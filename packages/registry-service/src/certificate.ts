import { Prisma } from "@prisma/client";
import flush from "just-flush";
import { addYears, fromUnixTime } from "date-fns";
import { NotFoundError } from "http-errors-enhanced";
import {
  Op,
  OpHolder,
  OpVerifier,
  OpCertifier,
  Jwk,
} from "@originator-profile/model";
import { signOp } from "@originator-profile/sign";
import { AccountService } from "./account";
import { ValidatorService } from "./validator";
import { getClient } from "@originator-profile/registry-db";

type Options = {
  validator: ValidatorService;
  account: AccountService;
};

type CertifierId = string;
type AccountId = string;
type OpId = string;

export const CertificateService = ({ account, validator }: Options) => ({
  /**
   * 認証機関か否かを判定する
   * @param id 認証機関 ID
   * @throws {NotFoundError} 組織情報が見つからない
   * @return 認証機関であれば true, そうでなければ false
   */
  async isCertifier(id: CertifierId): Promise<boolean> {
    const prisma = getClient();
    const data = await prisma.accounts.findUnique({
      where: { id },
      select: { roleValue: true },
    });

    if (!data) {
      throw new NotFoundError("OP Account not found.");
    }

    return data.roleValue === "certifier";
  },
  /**
   * OP への署名
   * @param id 認証機関 ID
   * @param accountId 会員 ID
   * @param privateKey JWK 形式のプライベート鍵
   * @param options 署名オプション
   * @throws {NotFoundError} 認証機関が見つからない/組織情報が見つからない
   * @return JWT でエンコードされた OP
   */
  async signOp(
    id: CertifierId,
    accountId: AccountId,
    privateKey: Jwk,
    options = {
      issuedAt: new Date(),
      expiredAt: addYears(new Date(), 10),
      validAt: new Date(),
    },
  ): Promise<string> {
    const prisma = getClient();
    const credentials = await prisma.credentials.findMany({
      where: { accountId, expiredAt: { gt: options.validAt } },
      orderBy: { id: "asc" },
      include: {
        certifier: true,
        verifier: true,
      },
    });
    const accountsInclude: Prisma.accountsInclude = {
      logos: true,
      businessCategories: true,
    };
    const data = await Promise.all([
      prisma.accounts.findMany({
        where: {
          id: {
            in: [id, ...credentials.map(({ certifierId }) => certifierId)],
          },
        },
        include: accountsInclude,
      }),
      prisma.accounts.findMany({
        where: {
          id: {
            in: credentials.map(({ verifierId }) => verifierId),
          },
        },
        include: accountsInclude,
      }),
      prisma.accounts.findUnique({
        where: { id: accountId },
        include: accountsInclude,
      }),
    ]);

    const [certifiers, verifiers, holder] = data;
    const certifier = certifiers.find((certifier) => certifier.id === id);
    if (!certifier) throw new NotFoundError("Certifier not found.");
    if (!holder) throw new NotFoundError("Holder not found.");

    const toAccountModel = (
      accounts: Prisma.accountsGetPayload<{
        include: typeof accountsInclude;
      }>,
    ): Partial<OpHolder | OpVerifier | OpCertifier> => ({
      ...flush(accounts),
      businessCategory: accounts.businessCategories?.map(
        ({ businessCategoryValue }) => businessCategoryValue,
      ),
    });
    const input: Op = {
      type: "op",
      issuedAt: options.issuedAt.toISOString(),
      expiredAt: options.expiredAt.toISOString(),
      issuer: certifier.domainName,
      subject: holder.domainName,
      item: [
        // @ts-expect-error any properties
        ...credentials.map((credential) => ({
          type: "credential",
          ...flush(credential),
          certifier: credential.certifier.domainName,
          verifier: credential.verifier.domainName,
          issuedAt: credential.issuedAt.toISOString(),
          expiredAt: credential.expiredAt.toISOString(),
        })),
        // @ts-expect-error any properties
        ...certifiers.map((certifier) => ({
          type: "certifier",
          ...toAccountModel(certifier),
        })),
        // @ts-expect-error any properties
        ...verifiers.map((verifier) => ({
          type: "verifier",
          ...toAccountModel(verifier),
        })),
        {
          // @ts-expect-error any properties
          type: "holder",
          ...toAccountModel(holder),
        },
      ],
    };

    const holderKeys = await account.getKeys(accountId);
    if (holderKeys.keys.length > 0) Object.assign(input, { jwks: holderKeys });
    const valid = validator.opValidate(input);
    const jwt: string = await signOp(valid, privateKey);
    return jwt;
  },
  /**
   * OP の発行
   * @param id 認証機関 ID
   * @param jwt JWT でエンコードされた OP
   * @throws {BadRequestError} バリデーション失敗
   * @return ops.id
   */
  async issue(id: CertifierId, jwt: string): Promise<OpId> {
    const prisma = getClient();
    const decoded = validator.decodeToken(jwt);
    const issuedAt: Date = fromUnixTime(decoded.payload.iat);
    const expiredAt: Date = fromUnixTime(decoded.payload.exp);
    const data = await prisma.ops.create({
      data: {
        certifierId: id,
        jwt,
        issuedAt,
        expiredAt,
      },
    });

    return data.id;
  },
});

export type CertificateService = ReturnType<typeof CertificateService>;
