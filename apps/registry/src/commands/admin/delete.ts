import { Command } from "@oclif/core";
import { Services } from "@originator-profile/registry-service";
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
    const services = Services({ config: { ISSUER_UUID: "" } });
    /* OCLIF の例外が e2e の globalSetup を失敗させてしまうので返さないようにする */
    try {
      const data = await services.admin.delete(flags.id);
      this.log(`UUID: ${data.adminId}`);
    } catch (e) {
      this.log(`Delete failed: UUID: ${flags.id}`);
    }
  }
}
