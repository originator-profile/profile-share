import { Command, Flags } from "@oclif/core";
import { addYears } from "date-fns";
import flush from "just-flush";
import { type Website as WebsiteType } from "@originator-profile/registry-service";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import { expirationDate, privateKey } from "../../flags";
import { Dp } from "@originator-profile/model";
import { signBody, signDp } from "@originator-profile/sign";

type Website = Omit<WebsiteType, "accountId" | "proofJws">;

export class PublisherSign extends Command {
  static summary = "Signed Document Profile (SDP) の生成";
  static description = `\
Web ページの情報 (DP) に対して署名を行います。
署名済み DP (SDP) を生成し、それを標準出力に出力します。`;
  static flags = {
    identity: privateKey({ required: true }),
    id: Flags.string({
      summary: "OP ID (ドメイン名)",
      description: "ドメイン名 (RFC 4501) を指定します。",
      required: true,
    }),
    input: Flags.string({
      summary: "JSON file",
      description: `\
ファイル名。ファイルには次のようなフォーマットの JSON を入れてください。空白行より上が必須プロパティです。
imageプロパティの画像リソースは拡張機能Webページから参照されます。埋め込み可能なようCORS許可しておいてください。

{
  "id": "ef9d78e0-d81a-4e39-b7a0-27e15405edc7",
  "url": "https://example.com/",
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
  "categories": [{
    "cat": "IAB1-1",
    "name": "Books & Literature",
    "cattax": 1
  }]
}
`,
      required: true,
    }),
    "issued-at": Flags.string({
      description: "発行日時 (ISO 8601)",
    }),
    "expired-at": expirationDate(),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(PublisherSign);
    const domainName = flags.id.toLowerCase().replace(/^dns:/, "");
    const inputBuffer = await fs.readFile(flags.input);
    const { body, ...input } = JSON.parse(inputBuffer.toString()) as Website & {
      body: string;
    };
    const privateKey = flags.identity;

    // body に署名して proofJws パラメータを生成
    const proofJws = await signBody(body, privateKey);

    const issuedAt = flags["issued-at"]
      ? new Date(flags["issued-at"])
      : new Date();
    const expiredAt = flags["expired-at"] ?? addYears(new Date(), 1);
    const dp = {
      type: "dp",
      issuer: domainName,
      subject: input.id ?? crypto.randomUUID(),
      issuedAt: issuedAt.toISOString(),
      expiredAt: expiredAt.toISOString(),
      item: [
        {
          type: "website",
          ...flush({
            url: input.url,
            title: input.title,
            image: input.image,
            description: input.description,
            "https://schema.org/author": input.author,
            category: input.categories?.map((category) => ({
              cat: category.cat,
              cattax: category.cattax,
              name: category.name,
            })),
            "https://schema.org/editor": input.editor,
            "https://schema.org/datePublished": input.datePublished,
            "https://schema.org/dateModified": input.dateModified,
          }),
        },
        {
          type: input.bodyFormat as "visibleText" | "text" | "html",
          url: input.url,
          location: input.location ?? undefined,
          proof: { jws: proofJws },
        },
      ],
    } satisfies Dp;
    const sdp = await signDp(dp, privateKey);
    this.log(sdp);
  }
}
