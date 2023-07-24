import { Command } from "@oclif/core";
import { Services } from "@originator-profile/registry-service";
import { accountId } from "../../flags";
import { prisma } from "../../prisma-client";

export class AdminDelete extends Command {
  static description = "管理者権限の削除";
  static flags = {
    id: accountId({
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(AdminDelete);
    const services = Services({ config: { ISSUER_UUID: "" }, prisma });
    const data = await services.admin.delete(flags.id);
    if (data instanceof Error) this.error(data);
    this.log(`UUID: ${data.adminId}`);
  }
}
