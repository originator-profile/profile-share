import { Command, Flags } from "@oclif/core";
import { PrismaClient } from "@prisma/client";
import path from "node:path";
import { create, start } from "../../server";
import { DbInit } from "../db/init";

export default class Start extends Command {
  static description = "API サーバーの起動";
  static flags = {
    ...DbInit.flags,
    port: Flags.string({
      char: "p",
      description: "Listen port",
      env: "PORT",
      default: "8080",
    }),
    "basic-auth-token": Flags.string({
      description: "Basic 認証用のトークン (デフォルト: 無効)",
      env: "BASIC_AUTH_TOKEN",
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
      basicAuthToken: flags["basic-auth-token"],
    });
    await start(server, flags.port);
  }
}
