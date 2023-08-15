import { Command, Flags, ux } from "@oclif/core";
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
    await DbInit.run([
      `--schema=${flags.schema}`,
      `--${flags.seed ? "" : "no-"}seed`,
    ]);
    const isDev = process.env.NODE_ENV === "development";
    const server = await create({
      isDev,
      routes: path.resolve(__dirname, "../../routes"),
    });
    await start(server, flags.port);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        // 文字列 Press any key to continue or q to exit: を端末に出力する
        // q が押された場合には例外を投げる。
        // eslint-disable-next-line no-await-in-loop
        await ux.anykey();
      } catch (Error) {
        break;
      }
    }
    this.exit();
  }
}
