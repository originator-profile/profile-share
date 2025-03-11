import { parseAccountId, parseExpirationDate } from "@originator-profile/core";
import {
  Jwk,
  OrganizationMetadata,
  OriginatorProfile,
  WebMediaProfile,
} from "@originator-profile/model";
import {
  getClient,
  OpAccountRepository,
  WmpRepository,
} from "@originator-profile/registry-db";
import { fetchAndSetDigestSri, signSdJwtOp } from "@originator-profile/sign";
import { signJwtVc } from "../../securing-mechanism/src/jwt";
import { Prisma } from "@prisma/client";
import { addYears, getUnixTime } from "date-fns";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "http-errors-enhanced";
import flush from "just-flush";
import Config from "./config";

import { AccountService } from "./account";
import { ValidatorService } from "./validator";

type Options = {
  config: Config;
  validator: ValidatorService;
  account: AccountService;
};

type CertifierId = string;
type AccountId = string;

export const CertificateService = ({
  account,
  validator,
  config,
}: Options) => ({
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
   * Originator Profile への署名
   * @param id 認証機関 ID
   * @param accountId 会員 ID
   * @param privateKey JWK 形式のプライベート鍵
   * @param options 署名オプション
   * @throws {NotFoundError} 認証機関が見つからない/組織情報が見つからない
   * @return SD-JWT でエンコードされた OP
   */
  async signOriginatorProfile(
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

    const vct = "https://originator-profile.org/organization";
    const iss =
      issuer.domainName === "localhost"
        ? "http://localhost:8080/"
        : `https://${issuer.domainName}/`;
    const input: OriginatorProfile = {
      vct,
      /*
       TODO: 本来は await calcIntegrity(vct) で計算するが、未公開なため https://next.docs-originator-profile-org.pages.dev/rfc/7/#sd-jwt-vc-type-metadata から
       あらかじめ計算した値。
       VC Type Metadataの最後に改行がないことに注意。
       */
      "vct#integrity": "sha256-w+4TN1Ad3s6wksEJtaJncFo8+CBg3i31nCuAntyZ70o=",
      iss,
      // https://github.com/originator-profile/profile/issues/1699
      "iss#integrity": "廃止予定",
      sub: holder.domainName,
      locale: "ja-JP",
      issuer: toAccountModel(issuer),
      holder: toAccountModel(holder),
      jwks: holderKeys,
      iat: getUnixTime(options.issuedAt),
      exp: getUnixTime(options.expiredAt),
    };

    const valid = validator.originatorProfileValidate(input);
    const jwt: string = await signSdJwtOp(valid, privateKey);
    return jwt;
  },
  /**
   * 保有者IDを検証する
   * @param holderId 保有者ID
   * @throws {NotFoundError} 保有者が存在しない場合
   */
  async validateHolder(holderId: string): Promise<void> {
    const prisma = getClient();
    const holder = await prisma.accounts.findUnique({
      where: { id: holderId },
    });

    if (!holder) {
      throw new NotFoundError(
        `Holder with ID ${holderId} does not exist. Please ensure the account is registered.`,
      );
    }
  },

  /**
   * Web Media Profile の登録・更新
   * @param accountId 会員 ID
   * @param uwmp 未署名 Web Media Profile オブジェクト
   * @throws {ForbiddenError} 会員 ID と Web Media Profile の発行者が一致しない
   * @throws {BadRequestError} 必須フィールドがない場合
   * @return Web Media Profile
   */
  async createOrUpdateWmp(
    accountId: string,
    {
      issuedAt: issuedAtDateOrString = new Date(),
      expiredAt: expiredAtDateOrString = addYears(new Date(), 1),
      ...uwmp
    }: {
      issuedAt?: Date | string;
      expiredAt?: Date | string;
    } & WebMediaProfile,
  ): Promise<string> {
    // 発行者の検証
    if (accountId !== parseAccountId(uwmp.issuer)) {
      throw new ForbiddenError(
        "OP Account ID does not match the issuer of the Web Media Profile.",
      );
    }

    // 必須フィールドの検証
    if (!uwmp.credentialSubject.id) {
      throw new BadRequestError(
        "Web Media Profile must have credentialSubject.id",
      );
    }

    // 保有者の検証
    const holderId = parseAccountId(uwmp.credentialSubject.id);
    await this.validateHolder(holderId);

    // 署名キーの取得
    const signingKey = await OpAccountRepository.findOrRegisterSigningKey(
      accountId,
      config.JOSE_SECRET as string,
    );

    // 日付の正規化
    const issuedAt = new Date(issuedAtDateOrString);
    const expiredAt =
      typeof expiredAtDateOrString === "string"
        ? parseExpirationDate(expiredAtDateOrString)
        : expiredAtDateOrString;

    // ロゴがある場合はSRIハッシュを計算
    if (uwmp.credentialSubject.logo) {
      await fetchAndSetDigestSri("sha256", uwmp.credentialSubject.logo);
    }

    // JWT署名とデータベース保存
    const wmp = await signJwtVc(uwmp, signingKey, { issuedAt, expiredAt });
    await this.saveWmp(wmp);

    return wmp;
  },

  /**
   * Web Media Profile をデータベースに保存する
   * @param wmp 署名済み Web Media Profile
   * @throws {NotFoundError} 発行者または保有者が存在しない場合
   */
  async saveWmp(wmp: string): Promise<void> {
    try {
      await WmpRepository.upsert(wmp);
    } catch (error) {
      if (!(error instanceof Error)) throw error;

      if (
        error.message.includes("Foreign key constraint violated") ||
        error.message.includes("P2003")
      ) {
        throw new NotFoundError(
          "The issuer or holder specified in the Web Media Profile does not exist in the system.",
        );
      }

      throw error;
    }
  },
});

export type CertificateService = ReturnType<typeof CertificateService>;
