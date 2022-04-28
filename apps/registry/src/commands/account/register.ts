import { Command, Flags } from "@oclif/core";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs/promises";

export class AccountRegister extends Command {
  static description = "会員の登録";
  static flags = {
    input: Flags.string({
      char: "i",
      description: "Prisma.accountsCreateManyInput (JSON) file",
      default: "account.example.json",
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(AccountRegister);
    const prisma = new PrismaClient();
    const input = await fs.readFile(flags.input);
    const account = await prisma.accounts.create({
      data: JSON.parse(input.toString()),
    });
    this.log(JSON.stringify(account, null, 2));
  }
}
