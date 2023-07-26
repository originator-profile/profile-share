import { prisma } from "../../prisma-client";

import { Command } from "@oclif/core";

const serializeUrl = (url: string) => new URL(url).href;

export class WebsiteUrlSerialization extends Command {
  static description = `websites テーブルの url カラムの値を serialize した url に更新します。`;

  async run(): Promise<void> {
    const allWebsites = await prisma.websites.findMany();
    allWebsites.forEach(async (website) => {
      const { id, url } = website;
      console.log(url);
      await prisma.websites.update({
        where: { id },
        data: { url: serializeUrl(url) },
      });
    });
  }
}
