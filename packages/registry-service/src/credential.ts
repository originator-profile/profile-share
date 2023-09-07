import { credentials } from "@prisma/client";
import { type CredentialRepository } from "@originator-profile/registry-db";

type Options = {
  credentialRepository: CredentialRepository;
};

export const CredentialService = ({ credentialRepository }: Options) => ({
  /**
   * 資格情報の作成
   * @param accountId 会員 ID
   * @param certifierId 認証機関 ID
   * @param verifierId 検証機関 ID
   * @param name 資格名
   * @param issuedAt 資格発行日
   * @param expiredAt 期限切れ日時
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
    imageUrl?: string,
  ): Promise<credentials | Error> {
    return credentialRepository.create(
      accountId,
      certifierId,
      verifierId,
      name,
      issuedAt,
      expiredAt,
      imageUrl,
    );
  },

  async update(
    credentialId: number,
    data: {
      certifierId?: string;
      verifierId?: string;
      name?: string;
      issuedAt?: Date;
      expiredAt?: Date;
      imageUrl?: string;
    },
  ): Promise<credentials | Error> {
    return credentialRepository.update(credentialId, data);
  },
  /**
   * 資格情報の削除
   * @param credentialId 資格情報 ID
   * @return 削除した資格情報またはエラー
   */
  async delete(credentialId: number): Promise<credentials | Error> {
    return credentialRepository.delete(credentialId);
  },
});

export type CredentialService = ReturnType<typeof CredentialService>;
