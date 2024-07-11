import { Prisma } from "@prisma/client";
import flush from "just-flush";
import { addYears, fromUnixTime, getUnixTime } from "date-fns";
import { NotFoundError } from "http-errors-enhanced";
import {
  Jwk,
  OrganizationMetadata,
  OriginatorProfile,
} from "@originator-profile/model";
import { signSdJwtOp } from "@originator-profile/sign";
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
    });
    if (credentials.length === 0) {
      throw new NotFoundError(
        "At least one credential is required to issue OP.",
      );
    }
    const accountsInclude: Prisma.accountsInclude = {
      logos: true,
    };
    const data = await Promise.all([
      prisma.accounts.findUnique({
        where: {
          id: id,
        },
        include: accountsInclude,
      }),
      prisma.accounts.findUnique({
        where: { id: accountId },
        include: accountsInclude,
      }),
    ]);

    const [issuer, holder] = data;

    if (!issuer) throw new NotFoundError("Issuer not found.");
    if (!holder) throw new NotFoundError("Holder not found.");

    const holderKeys = await account.getKeys(accountId);
    if (holderKeys.length === 0) {
      throw new NotFoundError("Holder must have at least one public key.");
    }

    const toAccountModel = (
      accounts: Prisma.accountsGetPayload<{
        include: typeof accountsInclude;
      }>,
    ) => {
      const {
        logos,
        addressCountry,
        addressLocality,
        addressRegion,
        description,
        ...rest
      } = accounts;
      const logo =
        logos?.find((l) => l.isMain)?.url || logos?.[0]?.url || undefined;
      // クレームの順序を整理する
      const metadata = {
        country: addressCountry,
        domain_name: rest.domainName,
        url: rest.url,
        name: rest.name,
        logo,
        corporate_number: rest.corporateNumber,
        email: rest.email,
        phone_number: rest.phoneNumber,
        postal_code: rest.postalCode,
        region: addressRegion,
        locality: addressLocality,
        street_address: rest.streetAddress,
        contact_title: rest.contactTitle,
        contact_url: rest.contactUrl,
        privacy_policy_title: rest.privacyPolicyTitle,
        privacy_policy_url: rest.privacyPolicyUrl,
        publishing_principle_title: rest.publishingPrincipleTitle,
        publishing_principle_url: rest.publishingPrincipleUrl,
        description:
          description !== null
            ? {
                type: "text/plain",
                data: description,
              }
            : undefined,
      };
      return flush(metadata) as OrganizationMetadata["holder"];
    };

    const input: OriginatorProfile = {
      vct: "https://originator-profile.org/orgnization",
      "vct#integrity": "sha256",
      iss:
        issuer.domainName === "localhost"
          ? "http://localhost:8080/"
          : `https://${issuer.domainName}/`,
      "iss#integrity": "sha256",
      sub: holder.domainName,
      locale: "ja-JP",
      issuer: toAccountModel(issuer),
      holder: toAccountModel(holder),
      jwks: holderKeys,
      iat: getUnixTime(options.issuedAt),
      exp: getUnixTime(options.expiredAt),
    };

    const valid = validator.opValidate(input);
    const jwt: string = await signSdJwtOp(valid, privateKey);
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
