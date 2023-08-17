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
  CredentialRepository,
} from "@originator-profile/registry-db";

export type { Website } from "./website";

type Options = {
  config: Config;
};

export { Config };

export const Services = (options: Options) => {
  const validator = ValidatorService();
  const account = AccountService({ ...options, validator });
  const admin = AdminService();
  const category = CategoryService();
  const certificate = CertificateService({ ...options, account, validator });
  const dpRepository = DpRepository();
  const websiteRepository = WebsiteRepository();
  const publisher = PublisherService({
    ...options,
    validator,
    dpRepository,
    websiteRepository,
  });
  const website = WebsiteService({ ...options, websiteRepository });
  const credentialRepository = CredentialRepository();
  const credential = CredentialService({ credentialRepository });
  return {
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
