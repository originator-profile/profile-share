import { Command, Flags } from "@oclif/core";
import fs from "node:fs/promises";
import { generateKeyJwk } from "@originator-profile/sign";

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
    const { publicKey, privateKey } = await generateKeyJwk();
    fs.writeFile(
      `${flags.output}.pub.json`,
      JSON.stringify(publicKey, null, 2),
    );
    fs.writeFile(flags.output, JSON.stringify(privateKey, null, 2));
  }
}
