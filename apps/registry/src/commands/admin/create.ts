import { Command, Flags, CliUx } from "@oclif/core";
import { PrismaClient } from "@prisma/client";
import { Services } from "@webdino/profile-registry-service";

export class AdminCreate extends Command {
  static description = "管理者の作成";
  static flags = {
    id: Flags.string({
      description: "会員 (デフォルト: ISSUER_UUID)",
      env: "ISSUER_UUID",
      default: "",
    }),
    password: Flags.string({
      description: "パスフレーズ",
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(AdminCreate);
    const prisma = new PrismaClient();
    const services = Services({ config: { ISSUER_UUID: flags.id }, prisma });
    const password =
      flags.password ??
      (await CliUx.ux.prompt("Enter Password", { type: "hide" }));
    const data = await services.admin.create(flags.id, password);
    if (data instanceof Error) this.error(data);
    this.log(`UUID: ${data.adminId}`);
  }
}
