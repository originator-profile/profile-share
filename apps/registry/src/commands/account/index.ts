import { Command, Flags } from "@oclif/core";
import { PrismaClient } from "@prisma/client";
import { Services } from "@webdino/profile-registry-service";
import fs from "node:fs/promises";

export class Account extends Command {
  static description = "会員の作成・表示・更新・削除";
  static flags = {
    input: Flags.string({
      char: "i",
      summary: "JSON file",
      description: `\
Prisma.accountsCreateInput または Prisma.accountsUpdateInput
詳細はデータベーススキーマを参照してください。`,
      default: "account.example.json",
      required: true,
    }),
    operation: Flags.enum({
      char: "o",
      description: "操作",
      options: ["create", "read", "update", "delete"],
      required: true,
    }),
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
    const data = await services.account[operation](input);
    if (data instanceof Error) this.error(data);
    this.log(`UUID: ${data.id}`);
  }
}
