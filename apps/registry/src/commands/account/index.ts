import { Command, Flags } from "@oclif/core";
import { PrismaClient } from "@prisma/client";
import { Services } from "@originator-profile/registry-service";
import fs from "node:fs/promises";
import { operation } from "../../flags";
import { parseAccountId } from "@originator-profile/core";

export class Account extends Command {
  static description = "会員の作成・表示・更新・削除";
  static flags = {
    input: Flags.string({
      char: "i",
      summary: "JSON file",
      description: `\
Prisma.accountsCreateInput または Prisma.accountsUpdateInput
詳細はTSDocを参照してください。
https://profile-docs.pages.dev/ts/modules/_originator-profile_profile_registry_db.default.Prisma
"id" フィールドの値には会員 ID またはドメイン名を指定可能です。`,
      default: "account.example.json",
      required: true,
    }),
    operation: operation(),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Account);
    const prisma = new PrismaClient();
    const services = Services({
      config: { ISSUER_UUID: process.env.ISSUER_UUID ?? "" },
      prisma,
    });
    const inputBuffer = await fs.readFile(flags.input);
    const input = JSON.parse(inputBuffer.toString());
    const operation = flags.operation as
      | "create"
      | "read"
      | "update"
      | "delete";
    if (typeof input.id === "string") {
      input.id = parseAccountId(input.id);
    }
    const data = await services.account[operation](input);
    if (data instanceof Error) this.error(data);
    this.log(JSON.stringify(data, null, 2));
  }
}
