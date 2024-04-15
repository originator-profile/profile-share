import { Command, Flags } from "@oclif/core";
import { addYears } from "date-fns";
import { Services } from "@originator-profile/registry-service";
import { accountId, expirationDate } from "../../flags";

const config = { ISSUER_UUID: process.env.ISSUER_UUID ?? "" };

export class ShowCredential extends Command {
  static description = "資格情報を表示します";
  static flags = {
    id: accountId({
      summary: "アカウントの ID またはドメイン名",
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ShowCredential);
    const services = Services({ config });

    const result = await services.credential.show(
      flags.id,
    );
    if (result instanceof Error) this.error(result);
    this.log(JSON.stringify(result, null, 2));
  }
}
