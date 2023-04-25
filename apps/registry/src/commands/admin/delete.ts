import { Command } from "@oclif/core";
import { PrismaClient } from "@prisma/client";
import { Services } from "@webdino/profile-registry-service";
import { accountId } from "../../flags";

export class AdminDelete extends Command {
  static description = "管理者権限の削除";
  static flags = {
    id: accountId({
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(AdminDelete);
    const prisma = new PrismaClient();
    const services = Services({ config: { ISSUER_UUID: "" }, prisma });
    const data = await services.admin.delete(flags.id);
    if (data instanceof Error) this.error(data);
    this.log(`UUID: ${data.adminId}`);
  }
}
