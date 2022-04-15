import { Command } from "@oclif/core";
import { PrismaClient } from "@prisma/client";
import { mock } from "vitest-mock-extended";
import path from "node:path";
import fs from "node:fs/promises";
import { create } from "../../server";

export default class OpenapiGen extends Command {
  static description = "OpenAPI ドキュメント生成";
  static args = [
    {
      name: "output",
      description: `出力先ファイル ("-": 標準出力)`,
      default: "dist/openapi.json",
    },
  ];

  async run(): Promise<void> {
    const { args } = await this.parse(OpenapiGen);
    const output: string = args.output;
    const server = create({
      isDev: true,
      prisma: mock<PrismaClient>(),
      routes: path.resolve(__dirname, "../../routes"),
      quiet: true,
    });
    await server.ready();
    const res = await server.inject("/documentation/json");
    if (output === "-") {
      this.log(res.payload);
      return;
    }
    await fs.writeFile(output, res.payload);
  }
}
