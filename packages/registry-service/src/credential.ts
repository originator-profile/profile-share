import { PrismaClient, Prisma, credentials } from "@prisma/client";

type Options = {
  prisma: PrismaClient;
};

export const CredentialService = ({
  prisma,
}: Options) => ({

  async create(input: Prisma.credentialsCreateInput): Promise<credentials | Error> {
    return prisma.credentials.create({ data: input }).catch((e: Error) => e);
  }

})


export type CredentialService = ReturnType<typeof CredentialService>;
