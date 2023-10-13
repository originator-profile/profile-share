import { credentials } from "@prisma/client";
import { type CredentialRepository } from "@originator-profile/registry-db";
import { CertificateService } from "./certificate";
import { BadRequestError } from "http-errors-enhanced";

type Options = {
  credentialRepository: CredentialRepository;
  certificate: CertificateService;
};

export const CredentialService = ({
  credentialRepository,
  certificate,
}: Options) => ({
  /**
   * 資格情報の作成
   * @param accountId 会員 ID
   * @param certifierId 認証機関 ID
   * @param verifierId 検証機関 ID
   * @param name 資格名
   * @param issuedAt 資格発行日
   * @param expiredAt 期限切れ日時
   * @param url 説明情報の URL
   * @param imageUrl 資格画像の URL
   * @return
   */
  async create(
    accountId: string,
    certifierId: string,
    verifierId: string,
    name: string,
    issuedAt: Date,
    expiredAt: Date,
    url?: string,
    imageUrl?: string,
  ): Promise<credentials | Error> {
    const isCertifier = await certificate.isCertifier(certifierId);
    if (isCertifier instanceof Error || !isCertifier) {
      throw new BadRequestError("invalid certifier");
    }
    return credentialRepository.create(
      accountId,
      certifierId,
      verifierId,
      name,
      issuedAt,
      expiredAt,
      url,
      imageUrl,
    );
  },
  /**
   * 資格情報の更新
   * @param credentialId 資格情報 ID
   * @param data 更新内容
   * @return 更新後の資格情報またはエラー
   */
  async update(
    credentialId: number,
    accountId: string,
    data: {
      certifierId?: string;
      verifierId?: string;
      name?: string;
      issuedAt?: Date;
      expiredAt?: Date;
      url?: string;
      imageUrl?: string;
    },
  ): Promise<credentials | Error> {
    if (data.certifierId) {
      const isCertifier = await certificate.isCertifier(data.certifierId);
      if (isCertifier instanceof Error || !isCertifier) {
        throw new BadRequestError("invalid certifier");
      }
    }
    return credentialRepository.update(credentialId, accountId, data);
  },
  /**
   * 資格情報の削除
   * @param credentialId 資格情報 ID
   * @return 削除した資格情報またはエラー
   */
  async delete(
    credentialId: number,
    accountId: string,
  ): Promise<credentials | Error> {
    return credentialRepository.delete(credentialId, accountId);
  },
});

export type CredentialService = ReturnType<typeof CredentialService>;
