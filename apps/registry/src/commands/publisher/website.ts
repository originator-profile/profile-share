import { Command, Flags } from "@oclif/core";
import { Jwk } from "@originator-profile/model";
import {
  Services,
  type Website as WebsiteType,
} from "@originator-profile/registry-service";
import { signBody } from "@originator-profile/sign";
import { SingleBar } from "cli-progress";
import { addYears } from "date-fns";
import { globby } from "globby";
import fs from "node:fs/promises";
import { accountId, expirationDate, operation, privateKey } from "../../flags";

type Website = Omit<WebsiteType, "accountId" | "proofJws">;

export class PublisherWebsite extends Command {
  static summary = "ウェブページ・SDPの作成・表示・更新・削除";
  static description = `ウェブページ・SDPの作成・表示・更新・削除を行います。

一度発行した SDP を更新したいときには、-o update オプションをつけて実行してください。
この際、発行した SDP の id を --input に指定する JSON ファイルに含める必要があります。

{
  "id": "0eb206ec-7b09-47cb-b879-abbb83f387a0",
  "author": "山田 一郎"
}

上のような JSON ファイルを用意し、コマンドを実行します。

$ <%= config.bin %> <%= command.id %> \
-i holder-key.priv.json \
--id example.com \
--input website.json \
-o update

SDP を DP レジストリから削除したいときには、-o delete オプションをつけて実行してください。
この際、発行した SDP の id を --input に指定する JSON ファイルに含める必要があります。

{
  "id": "0eb206ec-7b09-47cb-b879-abbb83f387a0"
}

上のような JSON ファイルを用意し、コマンドを実行します。

$ <%= config.bin %> <%= command.id %> \
-i holder-key.priv.json \
--id example.com \
--input website.json \
-o delete

`;
  static examples = [
    `<%= config.bin %> <%= command.id %> \
-o update \
-i holder-key.priv.json \
--id example.com \
--input website.json`,
    `<%= config.bin %> <%= command.id %> \
-o delete \
-i holder-key.priv.json \
--id example.com \
--input website.json`,
  ];

  static flags = {
    identity: privateKey({ required: true }),
    id: accountId({
      required: true,
    }),
    input: Flags.string({
      summary: "JSON file",
      description: `\
ファイル名。ファイルには次のようなフォーマットの JSON を入れてください。空白行より上が必須プロパティです。
imageプロパティの画像リソースは拡張機能Webページから参照されます。埋め込み可能なようCORS許可しておいてください。

{
  "id": "ef9d78e0-d81a-4e39-b7a0-27e15405edc7",
  "url": "http://localhost:8080",
  "location": "h1",
  "bodyFormat": "visibleText",
  "body": "OP 確認くん",

  "title": "OP 確認くん",
  "image": "https://example.com/image.png",
  "description": "このウェブページの説明です。",
  "author": "山田太郎",
  "editor": "山田花子",
  "datePublished": "2023-07-04T19:14:00Z",
  "dateModified": "2023-07-04T19:14:00Z",
  "categories": [{"cat": "IAB1"}, {"cat": "IAB1-1"}]
}
`,
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
    "expired-at": expirationDate(),
  };

  async #website(
    flags: Awaited<ReturnType<typeof this.parse>>["flags"],
  ): Promise<void> {
    const services = Services({
      config: { ISSUER_UUID: process.env.ISSUER_UUID ?? "" },
    });
    const inputBuffer = await fs.readFile(flags.input);
    const { body, ...input } = JSON.parse(inputBuffer.toString()) as Website & {
      body: string;
    };

    const privateKey = flags.identity as Jwk;
    const proofJws = await signBody(body, privateKey);

    // website サービスを呼び出す
    const operation = flags.operation as
      | "create"
      | "read"
      | "update"
      | "delete";

    const data = await services.website[operation]({
      ...input,
      accountId: flags.id,
      proofJws,
    });

    this.log(JSON.stringify(data, null, 2));
    if (!["create", "update"].includes(operation)) return;

    const issuedAt = flags["issued-at"]
      ? new Date(flags["issued-at"])
      : new Date();
    const expiredAt = flags["expired-at"] ?? addYears(new Date(), 1);

    // 受け取った情報から SDP を生成
    const jwt = await services.publisher.signDp(
      flags.id,
      input.id,
      privateKey,
      {
        issuedAt,
        expiredAt,
      },
    );

    // SDP をレジストリに登録
    await services.publisher.registerDp(flags.id, jwt);
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(PublisherWebsite);
    if (flags["input"]) {
      await this.#website(flags);
      return;
    }
    const paths = await globby(flags["glob-input"]);
    if (paths.length === 0) this.error("Pattern does not match any files");
    const bar = new SingleBar({});
    bar.start(paths.length, 0);
    await Promise.all(
      paths.map((path) =>
        this.#website({ ...flags, input: path }).then(() => bar.increment()),
      ),
    );
    bar.stop();
  }
}
