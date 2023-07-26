import { PrismaClient } from "@prisma/client";
import Config from "./config";
import { AccountService } from "./account";
import { AdminService } from "./admin";
import { CategoryService } from "./category";
import { CertificateService } from "./certificate";
import { ValidatorService } from "./validator";
import { PublisherService } from "./publisher";
import { WebsiteService } from "./website";
import { CredentialService } from "./credential";
import {
  DpRepository,
  WebsiteRepository,
} from "@originator-profile/registry-db";

export type { Website } from "./website";

type Options = {
  config: Config;
  prisma: PrismaClient;
};

export { Config };

export const Services = (options: Options) => {
  const validator = ValidatorService();
  const account = AccountService({ ...options, validator });
  const admin = AdminService(options);
  const category = CategoryService(options);
  const certificate = CertificateService({ ...options, account, validator });
  const dpRepository = DpRepository(options);
  const publisher = PublisherService({ ...options, validator, dpRepository });
  const websiteRepository = WebsiteRepository(options);
  const website = WebsiteService({ ...options, websiteRepository });
  const credential = CredentialService(options);
  return {
    prisma: options.prisma,
    validator,
    account,
    admin,
    category,
    certificate,
    publisher,
    website,
    credential,
  };
};

export type Services = ReturnType<typeof Services>;
