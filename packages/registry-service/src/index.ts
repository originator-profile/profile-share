import { PrismaClient } from "@prisma/client";
import Config from "./config";
import { AccountService } from "./account";

type Options = {
  config: Config;
  prisma: PrismaClient;
};

export { Config };

export const Services = (options: Options) => ({
  prisma: options.prisma,
  account: AccountService(options),
});

export type Services = ReturnType<typeof Services>;
