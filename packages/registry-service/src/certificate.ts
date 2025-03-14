import { parseAccountId, parseExpirationDate } from "@originator-profile/core";
import { WebMediaProfile } from "@originator-profile/model";
import {
  getClient,
  OpAccountRepository,
  WmpRepository,
} from "@originator-profile/registry-db";
import { fetchAndSetDigestSri } from "@originator-profile/sign";
import { signJwtVc } from "../../securing-mechanism/src/jwt";
import { addYears } from "date-fns";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "http-errors-enhanced";
import Config from "./config";

import { AccountService } from "./account";
import { ValidatorService } from "./validator";

type Options = {
  config: Config;
  validator: ValidatorService;
  account: AccountService;
};

type CertifierId = string;

export const CertificateService = ({ config }: Options) => ({
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
