import { Command, Flags, CliUx } from "@oclif/core";
import { Prisma } from "@prisma/client";
import fs from "node:fs/promises";
import { chromium } from "playwright";
import metascraper from "metascraper";
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
    "url": "https://oprdev.herokuapp.com",
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
  };

  private async extractWebsite({
    url,
    bodyFormat,
    location,
    output,
    ...override
  }: Website): Promise<void> {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url);
    const {
      url: _url,
      date: datePublished,
      ...metadata
    } = await metascraper([author(), date(), description(), image(), title()])({
      url,
      html: await page.content(),
    });
    const body = await extractBody(
      page.url(),
      (location) => page.locator(location),
      async (locator, attribute) =>
        locator.evaluateAll((elements, attribute) => {
          const isHTMLElement = (
            el: HTMLElement | SVGElement
          ): el is HTMLElement => typeof el.outerHTML === "string";
          return elements
            .filter(isHTMLElement)
            .map((el) => el[attribute] ?? "");
        }, attribute),
      {
        url,
        location,
        type: bodyFormat,
      }
    );
    const website = {
      url,
      location,
      bodyFormat: { connect: { value: bodyFormat } },
      body,
      datePublished,
      ...metadata,
      ...override,
    };
    await fs.writeFile(output, JSON.stringify(website, null, 2));
    await context.close();
    await browser.close();
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(PublisherExtractWebsite);
    const inputBuffer = await fs.readFile(flags.input);
    const websites = JSON.parse(inputBuffer.toString()) as Websites;
    const bar = CliUx.ux.progress();
    bar.start(websites.length, 0);
    await Promise.all(
      websites.map((website) =>
        this.extractWebsite(website).then(() => bar.increment())
      )
    );
    bar.stop();
  }
}
