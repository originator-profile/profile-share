import { Command, Flags } from "@oclif/core";
import { Services } from "@originator-profile/registry-service";
import fs from "node:fs";
import stream from "node:stream";
import { JsonLdDocument } from "jsonld";
import { prisma } from "@originator-profile/registry-db";

const config = { ISSUER_UUID: process.env.ISSUER_UUID ?? "" };

export class PublisherProfileSet extends Command {
  static description = "Profile Set の生成";
  static flags = {
    url: Flags.string({
      description: "ウェブページのURL",
      required: true,
    }),
    output: Flags.string({
      char: "o",
      description: `出力先ファイル ("-": 標準出力)`,
      default: "-",
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(PublisherProfileSet);
    const output =
      flags.output === "-"
        ? process.stdout
        : fs.createWriteStream(flags.output);
    const services = Services({ config, prisma });
    const data: JsonLdDocument | Error = await services.website.getProfileSet(
      flags.url,
    );
    if (data instanceof Error) this.error(data);
    const json = JSON.stringify(data, null, "  ");
    await stream.promises.finished(
      stream.Readable.from([json, `\n`]).pipe(output),
    );
  }
}
