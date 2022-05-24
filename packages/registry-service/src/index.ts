import { PrismaClient } from "@prisma/client";
import Config from "./config";
import { AccountService } from "./account";
import { CertificateService } from "./certificate";
import { ValidatorService } from "./validator";
import { PublisherService } from "./publisher";

type Options = {
  config: Config;
  prisma: PrismaClient;
};

export { Config };

export const Services = (options: Options) => {
  const validator = ValidatorService();
  const account = AccountService({ ...options, validator });
  const certificate = CertificateService({ ...options, account, validator });
  const publisher = PublisherService({ ...options, validator });
  return { prisma: options.prisma, validator, account, certificate, publisher };
};

export type Services = ReturnType<typeof Services>;
