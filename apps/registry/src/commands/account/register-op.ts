import { Command, Flags } from "@oclif/core";
import { PrismaClient } from "@prisma/client";
import { Services } from "@webdino/profile-registry-service";
import fs from "node:fs/promises";
import { accountId } from "../../flags";

export class AccountRegisterOp extends Command {
  static description =
    "Signed Originator Profile の登録 (Document Profile Registry 用)";
  static flags = {
    id: accountId({
      required: true,
    }),
    op: Flags.string({
      summary: "Signed Originator Profile ファイル",
      description: `\
Originator Profile レジストリから受け取った Signed Originator Profile ファイルを指定します。
JWT の含まれないファイルは無効です。また JWT の Subject クレームは会員自身のドメイン名と一致しなければなりません。`,
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(AccountRegisterOp);
    const prisma = new PrismaClient();
    const services = Services({ config: { ISSUER_UUID: "" }, prisma });
    const opFile = await fs.readFile(flags.op);
    const jwt = opFile.toString().trim();
    const op = await services.account.registerOp(flags.id, jwt);
    if (op instanceof Error) this.error(op);
    this.log("Done.");
  }
}
