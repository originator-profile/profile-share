import { Command, Flags } from "@oclif/core";
import { waitForDb } from "../../seed";
import { DbPrisma } from "./prisma";
import { DbSeed } from "./seed";
import { prisma } from "../../prisma-client";

export class DbInit extends Command {
  static description = "データベースの初期化";
  static flags = {
    schema: Flags.string({
      description: "Prisma schema file",
      default:
        "node_modules/@originator-profile/registry/dist/prisma/schema.prisma",
    }),
    seed: Flags.boolean({
      description: "Seed database",
      default: false,
      allowNo: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(DbInit);
    await waitForDb(prisma);
    await prisma.$disconnect();
    await DbPrisma.run(["migrate", "deploy", `--schema=${flags.schema}`]);
    if (flags.seed) await DbSeed.run();
  }
}
