import { Command, Flags } from "@oclif/core";
import { PrismaClient } from "@prisma/client";
import { addYears } from "date-fns";
import { Services } from "@webdino/profile-registry-service";
import fs from "node:fs/promises";

export class PublisherRegisterWebsite extends Command {
  static description = "ウェブページの登録";
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
    url: Flags.string({
      description: "URL",
      required: true,
    }),
    title: Flags.string({
      description: "Title",
    }),
    image: Flags.string({
      description: "Image URL",
    }),
    description: Flags.string({
      description: "Description",
    }),
    author: Flags.string({
      description: "Author",
    }),
    category: Flags.string({
      description: "Category",
    }),
    editor: Flags.string({
      description: "Editor",
    }),
    location: Flags.string({
      description: "対象の要素の場所 (CSS セレクター)",
    }),
    bodyFormat: Flags.enum({
      description: "対象のテキストの形式",
      options: ["html", "text", "visibleText"],
    }),
    body: Flags.string({
      description: "対象のテキストファイル (UTF-8)",
      required: true,
    }),
    "issued-at": Flags.string({
      description: "発行日時 (ISO 8601)",
    }),
    "expired-at": Flags.string({
      description: "有効期限 (ISO 8601)",
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(PublisherRegisterWebsite);
    const prisma = new PrismaClient();
    const services = Services({
      config: {
        ISSUER_UUID: process.env.ISSUER_UUID ?? "",
        JSONLD_CONTEXT:
          process.env.JSONLD_CONTEXT ?? "https://oprdev.herokuapp.com/context",
      },
      prisma,
    });
    const pkcs8File = await fs.readFile(flags.identity);
    const pkcs8 = pkcs8File.toString();
    const issuedAt = flags["issued-at"]
      ? new Date(flags["issued-at"])
      : new Date();
    const expiredAt = flags["expired-at"]
      ? new Date(flags["expired-at"])
      : addYears(new Date(), 1);
    const bodyFile = await fs.readFile(flags.body);
    const body = bodyFile.toString();
    const jwt = await services.publisher.registerWebsite(
      flags.id,
      pkcs8,
      {
        url: flags.url,
        location: flags.location,
        bodyFormat: flags.bodyFormat as "html" | "text" | "visibleText",
        body,
        website: {
          type: "website",
          url: flags.url,
          title: flags.title,
          image: flags.image,
          description: flags.description,
          "https://schema.org/author": flags.author,
          "https://schema.org/category": flags.category,
          "https://schema.org/editor": flags.editor,
        },
      },
      { issuedAt, expiredAt }
    );
    if (jwt instanceof Error) this.error(jwt);

    const dpId = await services.publisher.issueDp(flags.id, jwt);
    if (dpId instanceof Error) this.error(dpId);
    this.log("Done.");
  }
}
