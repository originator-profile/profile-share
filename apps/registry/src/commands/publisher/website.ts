import { Command, Flags, ux } from "@oclif/core";
import { PrismaClient, Prisma } from "@prisma/client";
import { addYears } from "date-fns";
import { Services } from "@webdino/profile-registry-service";
import fs from "node:fs/promises";
import { globby } from "globby";
import { operation } from "../../flags";

export class PublisherWebsite extends Command {
  static description = "ウェブページの作成・表示・更新・削除";
  static flags = {
    identity: Flags.string({
      char: "i",
      description: "PEM base64 でエンコードされた PKCS #8 秘密鍵ファイル",
      required: true,
    }),
    id: Flags.string({
      description: "会員 (UUID)",
      required: true,
    }),
    input: Flags.string({
      summary: "JSON file",
      description: `\
Prisma.websitesCreateInput または Prisma.websitesUpdateInput
詳細はTSDocを参照してください。
https://profile-docs.pages.dev/ts/modules/_webdino_profile_registry_db.default.Prisma`,
    }),
    "glob-input": Flags.string({
      summary: "JSON files match with glob pattern",
      exclusive: ["input"],
      default: "**/.website.json",
      required: true,
    }),
    operation: operation(),
    "issued-at": Flags.string({
      description: "発行日時 (ISO 8601)",
    }),
    "expired-at": Flags.string({
      description: "有効期限 (ISO 8601)",
    }),
  };

  async #website(
    flags: Awaited<ReturnType<typeof this.parse>>["flags"]
  ): Promise<void> {
    const prisma = new PrismaClient();
    const services = Services({
      config: { ISSUER_UUID: process.env.ISSUER_UUID ?? "" },
      prisma,
    });
    const inputBuffer = await fs.readFile(flags.input);
    const { body, ...input } = JSON.parse(
      inputBuffer.toString()
    ) as (Prisma.websitesCreateInput & Prisma.websitesUpdateInput) & {
      body: string;
    };
    const pkcs8File = await fs.readFile(flags.identity);
    const pkcs8 = pkcs8File.toString();
    const proofJws = await services.website.signBody(pkcs8, body);
    if (proofJws instanceof Error) throw proofJws;
    const operation = flags.operation as
      | "create"
      | "read"
      | "update"
      | "delete";
    const data = await services.website[operation]({
      ...input,
      account: { connect: { id: flags.id } },
      proofJws,
    });
    if (data instanceof Error) this.error(data);
    this.log(JSON.stringify(data, null, 2));
    if (!["create", "update"].includes(operation)) return;

    const issuedAt = flags["issued-at"]
      ? new Date(flags["issued-at"])
      : new Date();
    const expiredAt = flags["expired-at"]
      ? new Date(flags["expired-at"])
      : addYears(new Date(), 1);
    const jwt = await services.publisher.signDp(flags.id, input.url, pkcs8, {
      issuedAt,
      expiredAt,
    });
    if (jwt instanceof Error) this.error(jwt);

    const dpId = await services.publisher.registerDp(flags.id, jwt);
    if (dpId instanceof Error) this.error(dpId);
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(PublisherWebsite);
    if (flags["input"]) {
      await this.#website(flags);
      return;
    }
    const paths = await globby(flags["glob-input"]);
    if (paths.length === 0) this.error("Pattern does not match any files");
    const bar = ux.progress();
    bar.start(paths.length, 0);
    await Promise.all(
      paths.map((path) =>
        this.#website({ ...flags, input: path }).then(() => bar.increment())
      )
    );
    bar.stop();
  }
}
