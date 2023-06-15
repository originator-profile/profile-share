import { PrismaClient, Prisma, credentials } from "@prisma/client";

type Options = {
  prisma: PrismaClient;
};

export const CredentialService = ({ prisma }: Options) => ({
  /**
   * 資格情報の作成
   * @param accountId 会員 ID
   * @param certifierId 認証機関 ID
   * @param verifierId 検証機関 ID
   * @param name 資格名
   * @param issuedAt 資格発行日
   * @param expiredAt 資格失効日
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

    return prisma.credentials.create({ data: input }).catch((e: Error) => e);
  },
});

export type CredentialService = ReturnType<typeof CredentialService>;
