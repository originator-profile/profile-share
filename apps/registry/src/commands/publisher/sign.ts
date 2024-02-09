import { Command, Flags } from "@oclif/core";
import { addYears } from "date-fns";
import flush from "just-flush";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import {
  expirationDate,
  privateKey,
  allowedOrigins as allowedOriginsFlag,
} from "../../flags";
import { Dp, OgWebsite } from "@originator-profile/model";
import { signBody, signDp } from "@originator-profile/sign";

type Website = OgWebsite & {
  id?: string;
  body?: string;
  bodyFormat?: string;
  location?: string;
  categories: OgWebsite["category"];
  allowedOrigins?: string[];
};

const exampleSiteProfile: Omit<Website, "type"> = {
  title: "サイト名",
  image: "https://example.com/image.png",
  description: "サイトの説明",
};

const exampleWebpageMinimal: Omit<Website, "type"> = {
  url: "https://media.example.com/2023/06/hello/",
  location: "body",
  bodyFormat: "visibleText",
  body: "本文の例",
};

const exampleWebpage: Omit<Website, "type"> = {
  id: "ef9d78e0-d81a-4e39-b7a0-27e15405edc7",
  url: "http://localhost:8080/app/debugger",
  location: "body",
  bodyFormat: "visibleText",
  body: "本文",
  title: "ウェブページのタイトル",
  image: "https://example.com/image.png",
  description: "ウェブページの説明",
  author: "山田太郎",
  editor: "山田花子",
  datePublished: "2023-07-04T19:14:00Z",
  dateModified: "2023-07-04T19:14:00Z",
  categories: [
    {
      cat: "IAB1-1",
      name: "Books & Literature",
      cattax: 1,
    },
  ],
};

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
      summary: "入力ファイルのパス (JSON 形式)",
      helpValue: "<filepath>",
      description: `\
サイトプロファイルの例:

${JSON.stringify(exampleSiteProfile, null, "  ")}

ウェブページの例 (最小限):

${JSON.stringify(exampleWebpageMinimal, null, "  ")}

ウェブページの例:

${JSON.stringify(exampleWebpage, null, "  ")}`,
      required: true,
    }),
    "issued-at": Flags.string({
      description: "発行日時 (ISO 8601)",
    }),
    "expired-at": expirationDate(),
    "site-profile": Flags.boolean({
      description: "署名付きサイトプロファイルを出力する",
      default: false,
    }),
    "allowed-origins": allowedOriginsFlag({ required: false }),
  };
  static examples = [
    `\
$ <%= config.bin %> <%= command.id %> \\
    --site-profile \\
    -i example.priv.json \\
    --id media.example.com \\
    --allowed-origins '*' \\
    --input site-profile.json`,
    `\
$ <%= config.bin %> <%= command.id %> \\
    -i example.priv.json \\
    --id media.example.com \\
    --allowed-origins '*' \\
    --input webpage.json`,
  ];

  async run(): Promise<void> {
    const { flags } = await this.parse(PublisherSign);
    const domainName = flags.id.toLowerCase().replace(/^dns:/, "");
    const inputBuffer = await fs.readFile(flags.input);
    const { body, ...input } = JSON.parse(inputBuffer.toString()) as Website;
    const privateKey = flags.identity;

    const allowedOrigins = flags["allowed-origins"] || input.allowedOrigins;

    if (flags["site-profile"] && !allowedOrigins) {
      this.error("allowedOrigins is not specified.");
    }

    // body に署名して proofJws パラメータを生成
    let proofJws = "";
    if (!flags["site-profile"]) {
      proofJws = await signBody(body ?? "", privateKey);
    }

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
        ...(flags["site-profile"]
          ? []
          : [
              {
                type: input.bodyFormat as "visibleText" | "text" | "html",
                url: input.url,
                location: input.location,
                proof: { jws: proofJws },
              },
            ]),
      ],
      allowedOrigins,
    } satisfies Dp;
    const sdp = await signDp(dp, privateKey);
    this.log(sdp);
  }
}
