import {
  AdRepository,
  CertificationSystemRepository,
  CredentialRepository,
  DpRepository,
  RequestRepository,
  UserAccountRepository,
  WebsiteRepository,
} from "@originator-profile/registry-db";
import { AccountService } from "./account";
import { AdminService } from "./admin";
import { CategoryService } from "./category";
import { CertificateService } from "./certificate";
import Config from "./config";
import { CredentialService } from "./credential";
import { LogoService } from "./logo";
import { PublisherService } from "./publisher";
import { RequestService } from "./request";
import { UserAccountService } from "./user-account";
import { initLogger } from "./utils/logger";
import { ValidatorService } from "./validator";
import { WebsiteService } from "./website";

export type { Website } from "./website";

type Options = {
  config: Config;
};

export { Config };

export const Services = (options: Options = { config: {} }) => {
  initLogger(options.config.LOG_QUIET);
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
  const request = RequestService({
    requestRepository,
    userAccountRepository,
  });
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
    adRepository: AdRepository(),
    certificationSystemRepository: CertificationSystemRepository(),
  };
};

export type Services = ReturnType<typeof Services>;
