import {
  DpRepository,
  WebsiteRepository,
  CredentialRepository,
  UserAccountRepository,
  RequestRepository,
} from "@originator-profile/registry-db";
import Config from "./config";
import { AccountService } from "./account";
import { AdminService } from "./admin";
import { CategoryService } from "./category";
import { CertificateService } from "./certificate";
import { ValidatorService } from "./validator";
import { PublisherService } from "./publisher";
import { WebsiteService } from "./website";
import { CredentialService } from "./credential";
import { RequestService } from "./request";
import { LogoService } from "./logo";
import { UserAccountService } from "./user-account";

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
  const logo = LogoService({ ...options });
  const website = WebsiteService({ ...options, websiteRepository });
  const credentialRepository = CredentialRepository();
  const credential = CredentialService({ credentialRepository, certificate });
  const userAccountRepository = UserAccountRepository();
  const userAccount = UserAccountService({ ...options, userAccountRepository });
  const requestRepository = RequestRepository();
  const request = RequestService({ requestRepository });
  return {
    validator,
    account,
    admin,
    category,
    certificate,
    publisher,
    website,
    credential,
    logo,
    userAccount,
    request,
  };
};

export type Services = ReturnType<typeof Services>;
