import { Command, Flags } from "@oclif/core";
import { Services } from "@originator-profile/registry-service";
import { accountId } from "../../flags";

const config = { ISSUER_UUID: process.env.ISSUER_UUID ?? "" };

export class ShowCredential extends Command {
  static description = "資格情報を表示します";
  static flags = {
    id: accountId({
      summary: "アカウントの ID またはドメイン名",
      required: true,
    }),
    "valid-at": Flags.string({
      description:
        "この日時に既に失効している資格情報を含めない。デフォルトはすべての資格情報を表示する。",
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ShowCredential);
    const services = Services({ config });

<<<<<<< HEAD
    const result = await services.credential.show(flags.id);
=======
    const validAt = flags["valid-at"] ? new Date(flags["valid-at"]) : new Date(0);

    const result = await services.credential.show(
      flags.id,
      validAt,
    );
>>>>>>> 281e28c7 (feat: 資格情報を表示するコマンドに--valid-atオプションを追加)
    if (result instanceof Error) this.error(result);
    this.log(JSON.stringify(result, null, 2));
  }
}
