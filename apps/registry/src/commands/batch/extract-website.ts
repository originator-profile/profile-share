import { Command, Flags } from "@oclif/core";
import { Prisma } from "@prisma/client";
import { ExtractWebsite } from "../extract/website";
import { readFile } from "node:fs/promises";

export class BatchExtractWebsite extends Command {
  static description = "ウェブページの抽出の一括処理";
  static flags = {
    input: Flags.string({
      description: "ウェブページの抽出の入力 (JSON ファイル)",
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(BatchExtractWebsite);
    const inputBuffer = await readFile(flags.input);
    const websites = JSON.parse(inputBuffer.toString()) as Array<
      (Prisma.websitesCreateInput & Prisma.websitesUpdateInput) & {
        override?: Prisma.websitesUpdateInput;
        output: string;
      }
    >;
    for (const website of websites) {
      await ExtractWebsite.run([
        `--url=${website.url}`,
        `--body-format=${website.bodyFormat}`,
        `--location=${website.location}`,
        `--override=${JSON.stringify(website.override)}`,
        `--output=${website.output}`,
      ]);
    }
  }
}
