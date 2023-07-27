import { Command, Flags } from "@oclif/core";
import { Services } from "@originator-profile/registry-service";
import fs from "node:fs/promises";
import { accountId } from "../../flags";
import { prisma } from "@originator-profile/registry-db";

export class AccountRegisterKey extends Command {
  static description = "公開鍵の登録";
  static flags = {
    key: Flags.string({
      char: "k",
      description: "JWK 公開鍵ファイル",
      required: true,
    }),
    id: accountId({
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(AccountRegisterKey);
    const services = Services({
      config: { ISSUER_UUID: process.env.ISSUER_UUID ?? "" },
      prisma,
    });
    const keyFile = await fs.readFile(flags.key);
    const jwk = JSON.parse(keyFile.toString());
    const jwks = await services.account.registerKey(flags.id, jwk);
    if (jwks instanceof Error) this.error(jwks);
    this.log("Done.");
  }
}
