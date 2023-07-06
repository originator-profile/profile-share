import { Command, Flags, ux } from "@oclif/core";
import { PrismaClient } from "@prisma/client";
import { addYears } from "date-fns";
import {
  Services,
  type Website as WebsiteType,
} from "@webdino/profile-registry-service";
import fs from "node:fs/promises";
import { globby } from "globby";
import { accountId, operation } from "../../flags";

type Website = Omit<WebsiteType, "accountId" | "proofJws">;

export class PublisherWebsite extends Command {
  static description = "ウェブページの作成・表示・更新・削除";
  static flags = {
    identity: Flags.string({
      char: "i",
      description:
        "PEM base64 でエンコードされた PKCS #8 プライベート鍵ファイル",
      required: true,
    }),
    id: accountId({
      required: true,
    }),
    input: Flags.string({
      summary: "JSON file",
      description: `\
ファイル名。ファイルには次のようなフォーマットの JSON を入れてください。空白行より上が必須プロパティです。

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
    const { body, ...input } = JSON.parse(inputBuffer.toString()) as Website & {
      body: string;
    };

    // body に署名して proofJws パラメータを生成
    const pkcs8File = await fs.readFile(flags.identity);
    const pkcs8 = pkcs8File.toString();
    const proofJws = await services.website.signBody(pkcs8, body);
    if (proofJws instanceof Error) throw proofJws;

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

    if (data instanceof Error) this.error(data);
    this.log(JSON.stringify(data, null, 2));
    if (!["create", "update"].includes(operation)) return;

    const issuedAt = flags["issued-at"]
      ? new Date(flags["issued-at"])
      : new Date();
    const expiredAt = flags["expired-at"]
      ? new Date(flags["expired-at"])
      : addYears(new Date(), 1);

    // 受け取った情報から SDP を生成
    const jwt = await services.publisher.signDp(flags.id, input.id, pkcs8, {
      issuedAt,
      expiredAt,
    });
    if (jwt instanceof Error) this.error(jwt);

    // SDP をレジストリに登録
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
