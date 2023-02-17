import { Command, Flags } from "@oclif/core";
import fs from "node:fs/promises";
import { chromium, Locator } from "playwright";
import metascraper from "metascraper";
import author from "metascraper-author";
import date from "metascraper-date";
import description from "metascraper-description";
import image from "metascraper-image";
import title from "metascraper-title";

async function extractBody(
  locator: Locator,
  type: "visibleText" | "text" | "html"
): Promise<string> {
  switch (type) {
    case "visibleText": {
      const result = await locator.allInnerTexts();
      return result.join("");
    }
    case "text": {
      const result = await locator.allTextContents();
      return result.join("");
    }
    case "html": {
      const locators = await locator.all();
      const result = await Promise.all(
        locators.map((locator) => locator.innerHTML())
      );
      return result.join("");
    }
  }
}

export class PublisherExtractWebsite extends Command {
  static description = "ウェブページの抽出";
  static flags = {
    url: Flags.string({
      description: "ウェブページの URL",
      required: true,
    }),
    "body-format": Flags.enum({
      char: "f",
      description: "対象のテキストの形式",
      options: ["visibleText", "text", "html"],
      required: true,
    }),
    location: Flags.string({
      char: "l",
      description: "対象の要素の場所を特定する CSS セレクター",
    }),
    override: Flags.string({
      summary: "ウェブサイトの上書き (JSON 文字列)",
      description: `\
Prisma.websitesUpdateInput
詳細はTSDocを参照してください。
https://profile-docs.pages.dev/ts/modules/_webdino_profile_registry_db.default.Prisma`,
    }),
    output: Flags.string({
      char: "o",
      description: "ウェブサイトの保存先",
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(PublisherExtractWebsite);
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(flags.url);
    const locator = page.locator(flags.location ?? ":root");
    const bodyFormat = flags["body-format"] as "visibleText" | "text" | "html";
    const {
      url: _url,
      date: datePublished,
      ...metadata
    } = await metascraper([author(), date(), description(), image(), title()])({
      url: flags.url,
      html: await page.content(),
    });
    const body = await extractBody(locator, bodyFormat);
    const override = JSON.parse(flags.override ?? "{}");
    const website = {
      url: flags.url,
      location: flags.location,
      bodyFormat: { connect: { value: flags["body-format"] } },
      body,
      datePublished,
      ...metadata,
      ...override,
    };
    await fs.writeFile(flags.output, JSON.stringify(website, null, 2));
    await context.close();
    await browser.close();
  }
}
