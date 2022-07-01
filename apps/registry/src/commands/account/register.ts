import { Command, Flags } from "@oclif/core";
import { PrismaClient } from "@prisma/client";
import { Services } from "@webdino/profile-registry-service";
import fs from "node:fs/promises";

export class AccountRegister extends Command {
  static description = "会員の登録";
  static flags = {
    input: Flags.string({
      char: "i",
      summary: "Prisma.accountsCreateInput (JSON) file",
      description: "詳細はデータベーススキーマを参照してください。",
      default: "account.example.json",
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(AccountRegister);
    const prisma = new PrismaClient();
    const services = Services({
      config: { ISSUER_UUID: process.env.ISSUER_UUID ?? "" },
      prisma,
    });
    const inputBuffer = await fs.readFile(flags.input);
    const input = JSON.parse(inputBuffer.toString());
    const data = await services.account.create(input);
    if (data instanceof Error) this.error(data);
    this.log(`UUID: ${data.id}`);
  }
}
