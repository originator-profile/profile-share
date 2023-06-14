import { PrismaClient, Prisma, credentials } from "@prisma/client";

type Options = {
  prisma: PrismaClient;
};

export const CredentialService = ({ prisma }: Options) => ({
  async create(
    accountId: string,
    certifierId: string,
    verifierId: string,
    name: string,
    imageUrl: string,
    issuedAt: Date,
    expiredAt: Date
  ): Promise<credentials | Error> {
    const input: Prisma.credentialsCreateInput = {
      account: {
        connect: {id: accountId}
      },
      certifier: {
        connect: {id: certifierId}
      },
      verifier: {
        connect: {id: verifierId}
      },
      name: name,
      image: imageUrl,
      issuedAt,
      expiredAt
    }

    return prisma.credentials.create({ data: input }).catch((e: Error) => e);
  },
});

export type CredentialService = ReturnType<typeof CredentialService>;
