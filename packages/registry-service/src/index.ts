import { PrismaClient } from "@prisma/client";
import Config from "./config";
import { AccountService } from "./account";
import { CertificateService } from "./certificate";
import { ValidatorService } from "./validator";

type Options = {
  config: Config;
  prisma: PrismaClient;
};

export { Config };

export const Services = (options: Options) => {
  const validator = ValidatorService();
  const account = AccountService({ ...options, validator });
  const certificate = CertificateService({ ...options, account, validator });
  return { prisma: options.prisma, validator, account, certificate };
};

export type Services = ReturnType<typeof Services>;
