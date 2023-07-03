import { Command, Flags } from "@oclif/core";
import fs from "node:fs/promises";
import { generateKey } from "@webdino/profile-sign";

export class KeyGen extends Command {
  static description = "鍵ペアの生成";
  static flags = {
    output: Flags.string({
      char: "o",
      description: "プライベート鍵の保存先",
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(KeyGen);
    const { jwk, pkcs8 } = await generateKey();
    fs.writeFile(`${flags.output}.pub.json`, JSON.stringify(jwk));
    fs.writeFile(flags.output, pkcs8);
  }
}
