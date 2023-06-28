import { Command, Flags, ux } from "@oclif/core";
import { Prisma } from "@prisma/client";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import { chromium, BrowserContextOptions } from "playwright";
import metascraper, { Metadata } from "metascraper";
import author from "metascraper-author";
import date from "metascraper-date";
import description from "metascraper-description";
import image from "metascraper-image";
import title from "metascraper-title";
import { extractBody } from "@webdino/profile-verify";

type Website = Prisma.websitesUpdateInput & {
  url: string;
  bodyFormat: "visibleText" | "text" | "html";
  location?: string;
  output: string;
};
type Websites = Array<Website>;
type CliContext = { [key: string]: BrowserContextOptions };

const toWebsite = (metadata: Metadata): Partial<Website> => {
  const { url: _url, date: datePublished, ...other } = metadata;
  return { datePublished, ...other };
};

export class PublisherExtractWebsite extends Command {
  static description = "ウェブページの抽出";
  static flags = {
    input: Flags.string({
      summary: "ウェブページの抽出の入力 (JSON ファイル)",
      description: `\
以下のデータ形式を受け付けます。
[
  {
    // ウェブサイトの URL
    "url": "https://originator-profile.org/",
    // 対象のテキストの形式
    "bodyFormat": "visibleText",
    // 対象の要素の場所を特定する CSS セレクター (省略可)
    "location": "h1",
    // ウェブサイトの保存先
    "output": "./path/to/.website.json"
    // その他 Prisma.websitesUpdateInput を受け付けます
  },
  ...
]
Prisma.websitesUpdateInput については
詳細はTSDocを参照してください。
https://profile-docs.pages.dev/ts/modules/_webdino_profile_registry_db.default.Prisma`,
      required: true,
    }),
    context: Flags.string({
      summary:
        "ウェブページの抽出に必要なコンテキストのオプション（JSON ファイル）",
      description: `\
以下のデータ形式を受け付けます。
{
  // ウェブサイトの URL の先頭の文字列
  "https://originator-profile.org/": {
    // BrowserContextOptions
  },
  ...
}
BrowserContextOptions については
詳細はPlaywrightの公式ドキュメントを参照してください。
https://playwright.dev/docs/api/class-browser#browser-new-context`,
    }),
    metadata: Flags.boolean({
      description: "metascraper による OGP などのメタデータの取得",
      default: true,
      allowNo: true,
    }),
  };

  async #extractWebsite(
    { url, bodyFormat, location, output, ...override }: Website,
    metadataRequired: boolean,
    cliContext: CliContext
  ): Promise<void> {
    const browser = await chromium.launch();
    const [, browserContextOptions] =
      Object.entries(cliContext).find(([urlHead]) =>
        new URL(url).href.startsWith(new URL(urlHead).href)
      ) ?? [];
    const context = await browser.newContext(browserContextOptions);
    const page = await context.newPage();
    await page.goto(url);
    let metadata = {};
    if (metadataRequired) {
      metadata = toWebsite(
        await metascraper([author(), date(), description(), image(), title()])({
          url,
          html: await page.content(),
        })
      );
    }
    const body = await extractBody(
      page.url(),
      (location) => page.locator(location).all(),
      {
        url,
        location,
        type: bodyFormat,
      }
    );
    const website = {
      id: crypto.randomUUID(),
      url,
      location,
      bodyFormat: { connect: { value: bodyFormat } },
      body,
      ...metadata,
      ...override,
    };
    await fs.writeFile(output, JSON.stringify(website, null, 2) + "\n");
    await context.close();
    await browser.close();
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(PublisherExtractWebsite);
    const inputBuffer = await fs.readFile(flags.input);
    const websites = JSON.parse(inputBuffer.toString()) as Websites;
    let context: CliContext = {};
    if (flags.context) {
      const contextBuffer = await fs.readFile(flags.context);
      context = JSON.parse(contextBuffer.toString());
    }
    const bar = ux.progress();
    bar.start(websites.length, 0);
    await Promise.all(
      websites.map((website) =>
        this.#extractWebsite(website, flags.metadata, context).then(() =>
          bar.increment()
        )
      )
    );
    bar.stop();
  }
}
