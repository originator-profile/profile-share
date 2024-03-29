import { Prisma, credentials } from "@prisma/client";
import { getClient } from "./lib/prisma-client";

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
   * @return 資格情報
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
  ): Promise<credentials> {
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
      url,
      issuedAt,
      expiredAt,
    };

    const prisma = getClient();
    return await prisma.credentials.create({
      data: input,
    });
  },

  /**
   * 資格情報の更新
   * @param credentialId 資格情報 ID
   * @param data 更新内容
   * @return 資格情報
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
  ): Promise<credentials> {
    const prisma = getClient();
    return await prisma.credentials.update({
      where: { id: credentialId, accountId },
      data: data,
    });
  },
  /**
   * 資格情報の削除
   * @param credentialId 資格情報 ID
   * @return 削除した資格情報
   */
  async delete(credentialId: number, accountId: string): Promise<credentials> {
    const prisma = getClient();
    return await prisma.credentials.delete({
      where: { id: credentialId, accountId },
    });
  },
});

export type CredentialRepository = ReturnType<typeof CredentialRepository>;
