import { Command, Flags } from "@oclif/core";
import { Services } from "@originator-profile/registry-service";
import crypto from "node:crypto";
import { HttpError, isHttpError } from "http-errors-enhanced";
import { parseAccountId } from "@originator-profile/core";

export class AdminCreate extends Command {
  static description = "管理者の作成";
  static flags = {
    id: Flags.string({
      summary: "会員 ID またはドメイン名",
      description: `\
UUID 文字列表現 (RFC 9562) またはドメイン名 (RFC 4501) を指定します。
会員を新規登録する場合、ドメイン名でなければなりません。`,
      required: true,
    }),
    password: Flags.string({
      description: "パスフレーズ",
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(AdminCreate);
    const services = Services({ config: { ISSUER_UUID: "" } });
    const account = await services.account
      .read({
        id: parseAccountId(flags.id),
      })
      .catch((e: HttpError) => e);
    let id: string;
    if (isHttpError(account) && account.status === 404) {
      const data = await services.account.create({
        domainName: flags.id,
        name: "REDACTED FOR PRIVACY",
        postalCode: "REDACTED FOR PRIVACY",
        addressCountry: "REDACTED FOR PRIVACY",
        addressRegion: "REDACTED FOR PRIVACY",
        addressLocality: "REDACTED FOR PRIVACY",
        streetAddress: "REDACTED FOR PRIVACY",
      });
      id = data.id;
    } else {
      id = account.id;
    }

    const password =
      flags.password ?? crypto.randomBytes(32).toString("base64url");
    const data = await services.admin.create(id, password);
    this.log(`Secret: ${data.adminId}:${password}`);
  }
}
