import { Command, Flags } from "@oclif/core";
import { PrismaClient } from "@prisma/client";
import { Services } from "@webdino/profile-registry-service";
import crypto from "node:crypto";
import { NotFoundError } from "http-errors-enhanced";
import { parseAccountId } from "@webdino/profile-core";

export class AdminCreate extends Command {
  static description = "管理者の作成";
  static flags = {
    id: Flags.string({
      summary: "会員 ID またはドメイン名",
      description: `\
UUID 文字列表現 (RFC 4122) またはドメイン名 (RFC 4501) を指定します。
会員を新規登録する場合、ドメイン名でなければなりません。`,
      required: true,
    }),
    password: Flags.string({
      description: "パスフレーズ",
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(AdminCreate);
    const prisma = new PrismaClient();
    const services = Services({ config: { ISSUER_UUID: "" }, prisma });
    const account = await services.account.read({
      id: parseAccountId(flags.id),
    });
    let id: string;
    if (account instanceof NotFoundError) {
      const data = await services.account.create({
        domainName: flags.id,
        name: "REDACTED FOR PRIVACY",
        postalCode: "REDACTED FOR PRIVACY",
        addressCountry: "REDACTED FOR PRIVACY",
        addressRegion: "REDACTED FOR PRIVACY",
        addressLocality: "REDACTED FOR PRIVACY",
        streetAddress: "REDACTED FOR PRIVACY",
      });
      if (data instanceof Error) this.error(data);
      id = data.id;
    } else if (!(account instanceof Error)) {
      id = account.id;
    } else {
      this.error(account);
    }
    const password =
      flags.password ?? crypto.randomBytes(32).toString("base64url");
    const data = await services.admin.create(id, password);
    if (data instanceof Error) this.error(data);
    this.log(`Secret: ${data.adminId}:${password}`);
  }
}
