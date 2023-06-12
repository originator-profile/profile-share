import { Command, Flags, ux } from "@oclif/core";
import { PrismaClient, Prisma } from "@prisma/client";
import { Services } from "@webdino/profile-registry-service";
import fs from "node:fs/promises";
import { globby } from "globby";
import { operation } from "../../../flags";

export class PublisherWebsiteCategory extends Command {
  static description = "カテゴリーの作成・表示・更新・削除";
  static flags = {
    input: Flags.string({
      summary: "JSON file",
      description: `\
Prisma.categoriesCreateInput または Prisma.categoriesUpdateInput
詳細はTSDocを参照してください。
https://profile-docs.pages.dev/ts/modules/_webdino_profile_registry_db.default.Prisma`,
    }),
    "glob-input": Flags.string({
      summary: "JSON files match with glob pattern",
      exclusive: ["input"],
      default: "**/.category.json",
      required: true,
    }),
    operation: operation(),
  };

  async #category(
    flags: Awaited<ReturnType<typeof this.parse>>["flags"]
  ): Promise<void> {
    const prisma = new PrismaClient();
    const services = Services({
      config: { ISSUER_UUID: process.env.ISSUER_UUID ?? "" },
      prisma,
    });
    const inputBuffer = await fs.readFile(flags.input);
    const input = JSON.parse(
      inputBuffer.toString()
    ) as (Prisma.categoriesCreateInput & Prisma.categoriesUpdateInput) & {
      cat: string;
      cattax: number;
    };
    const operation = flags.operation as
      | "create"
      | "read"
      | "update"
      | "delete";
    const data = await services.category[operation](input);
    if (data instanceof Error) this.error(data);
    this.log(JSON.stringify(data, null, 2));
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(PublisherWebsiteCategory);
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
        this.#category({ ...flags, input: path }).then(() => bar.increment())
      )
    );
    bar.stop();
  }
}
