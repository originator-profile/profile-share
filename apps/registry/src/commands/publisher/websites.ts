import { Command, Flags, CliUx } from "@oclif/core";
import { globby } from "globby";
import { PublisherWebsite } from "./website";
import { join } from "node:path";

export class PublisherPublisherWebsites extends Command {
  static description = "ウェブページの作成・表示・更新・削除の一括処理";
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
    operation: Flags.enum({
      char: "o",
      description: "操作",
      options: ["create", "read", "update", "delete"],
      required: true,
    }),
    filename: Flags.string({
      char: "f",
      summary: "入力ファイル名",
      description:
        "ウェブサイトのデータを格納しているファイルの名称を指定してください。指定されたファイル名で再帰的に探索します。",
      default: ".website.json",
    }),
    "issued-at": Flags.string({
      description: "発行日時 (ISO 8601)",
    }),
    "expired-at": Flags.string({
      description: "有効期限 (ISO 8601)",
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(PublisherPublisherWebsites);
    const paths = await globby(join("**", flags.filename));
    const bar = CliUx.ux.progress();
    bar.start(paths.length, 0);
    await Promise.all(
      paths.map((path) =>
        PublisherWebsite.run([
          `--identity=${flags.identity}`,
          `--id=${flags.id}`,
          `--input=${path}`,
          `--operation=${flags.operation}`,
          `--issued-at=${flags["issued-at"]}`,
          `--expired-at=${flags["expired-at"]}`,
        ]).then(() => bar.increment())
      )
    );
    bar.stop();
  }
}
