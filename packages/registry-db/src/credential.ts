import { Prisma, credentials } from "@prisma/client";
import { getClient } from "@originator-profile/registry-db";

export const CredentialRepository = () => ({
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
    imageUrl?: string
  ): Promise<credentials | Error> {
    const input: Prisma.credentialsCreateInput = {
      account: {
        connect: { id: accountId },
      },
      certifier: {
        connect: { id: certifierId },
      },
      verifier: {
        connect: { id: verifierId },
      },
      name: name,
      image: imageUrl,
      issuedAt,
      expiredAt,
    };

    const prisma = getClient();
    return prisma.credentials.create({ data: input }).catch((e: Error) => e);
  },

  /**
   * 資格情報の更新
   * @param credentialId 資格情報 ID
   * @param data 更新内容
   * @return 更新結果またはエラー
   */
  async update(
    credentialId: number,
    data: {
      certifierId?: string;
      verifierId?: string;
      name?: string;
      issuedAt?: Date;
      expiredAt?: Date;
      imageUrl?: string;
    }
  ): Promise<credentials | Error> {
    const prisma = getClient();
    return prisma.credentials
      .update({ where: { id: credentialId }, data: data })
      .catch((e: Error) => e);
  },
  /**
   * 資格情報の削除
   * @param credentialId 資格情報 ID
   * @return 削除した資格情報またはエラー
   */
  async delete(credentialId: number): Promise<credentials | Error> {
    const prisma = getClient();
    return prisma.credentials
      .delete({ where: { id: credentialId } })
      .catch((e: Error) => e);
  },
});

export type CredentialRepository = ReturnType<typeof CredentialRepository>;
