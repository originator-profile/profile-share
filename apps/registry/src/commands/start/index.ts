import { Command, Flags } from "@oclif/core";
import { PrismaClient } from "@prisma/client";
import path from "node:path";
import { create, start } from "../../server";
import { DbInit } from "../db/init";

export default class Start extends Command {
  static description = "API サーバーの起動";
  static flags = {
    ...DbInit.flags,
    port: Flags.integer({
      char: "p",
      description: "Listen port",
      env: "PORT",
      default: 8080,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Start);
    await DbInit.run(this.argv);
    const isDev = process.env.NODE_ENV === "development";
    const prisma = new PrismaClient();
    const server = create({
      isDev,
      prisma,
      routes: path.resolve(__dirname, "../../routes"),
    });
    await start(server, flags.port);
  }
}
