import { Command, Flags, ux } from "@oclif/core";
import { PrismaClient, Prisma } from "@prisma/client";
import { Services } from "@originator-profile/registry-service";
import fs from "node:fs/promises";
import { globby } from "globby";

export class PublisherCategory extends Command {
  static description = "カテゴリーの作成・表示・削除";
  static flags = {
    input: Flags.string({
      summary: "JSON file",
      description: `\
Prisma.Enumerable<Prisma.categoriesCreateManyInput>
詳細はTSDocを参照してください。
https://profile-docs.pages.dev/ts/modules/_originator-profile_profile_registry_db.default.Prisma`,
    }),
    "glob-input": Flags.string({
      summary: "JSON files match with glob pattern",
      exclusive: ["input"],
      default: "**/category.json",
      required: true,
    }),
    operation: Flags.string({
      char: "o",
      description: "操作",
      options: ["createMany"],
      required: true,
    }),
  };

  async #category(
    flags: Awaited<ReturnType<typeof this.parse>>["flags"],
  ): Promise<void> {
    const prisma = new PrismaClient();
    const services = Services({
      config: { ISSUER_UUID: process.env.ISSUER_UUID ?? "" },
      prisma,
    });
    const inputBuffer = await fs.readFile(flags.input);
    const input = JSON.parse(
      inputBuffer.toString(),
    ) as Prisma.Enumerable<Prisma.categoriesCreateManyInput>;
    const operation = flags.operation as "createMany";
    const data = await services.category[operation](input);
    if (data instanceof Error) this.error(data);
    this.log(JSON.stringify(data, null, 2));
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(PublisherCategory);
    if (flags["input"]) {
      await this.#category(flags);
      return;
    }
    const paths = await globby(flags["glob-input"]);
    if (paths.length === 0) this.error("Pattern does not match any files");
    const bar = ux.progress();
    bar.start(paths.length, 0);
    await Promise.all(
      paths.map((path) =>
        this.#category({ ...flags, input: path }).then(() => bar.increment()),
      ),
    );
    bar.stop();
  }
}
