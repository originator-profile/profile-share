import { Command, Flags } from "@oclif/core";
import { Prisma } from "@prisma/client";
import { Services } from "@originator-profile/registry-service";
import fs from "node:fs/promises";
import { operation } from "../../flags";
import { parseAccountId } from "@originator-profile/core";
import example from "../../account.example.json";

const jsonFormat = {
  id: "<UUID v5 for domain names 形式 OP ID>",
  domainName: "<OP ID>",
  roleValue: "<種別 - group: 組織、certifier: 認証機関>",
  name: "<法人名*>",
  url: "<ウェブサイトのURL>",
  corporateNumber: "<法人番号>",
  description:
    "<説明 (ウェブメディアそれを運用する法人、認定機関、業界団体等であることの記述)>",
  email: "<メールアドレス>",
  phoneNumber: "<電話番号>",
  postalCode: "<郵便番号*>",
  addressCountry: "<国*>",
  addressRegion: "<都道府県*>",
  addressLocality: "<市区町村*>",
  streetAddress: "<番地・ビル名*>",
  contactTitle: "<連絡先表示名>",
  contactUrl: "<連絡先URL>",
  privacyPolicyTitle: "<プライバシーポリシー表示名>",
  privacyPolicyUrl: "<プライバシーポリシーURL>",
  publishingPrincipleTitle: "<編集ガイドライン表示名>",
  publishingPrincipleUrl: "<編集ガイドラインURL>",
  logos: {
    create: [
      {
        url: "<ロゴURL>",
        isMain: true,
      },
    ],
  },
} satisfies Prisma.accountsCreateInput & {
  roleValue: string;
};

export class Account extends Command {
  static description = "組織の作成・表示・更新・削除";
  static flags = {
    input: Flags.string({
      char: "i",
      summary: "入力ファイルのパス (JSON 形式)",
      description: `\
書式:

${JSON.stringify(jsonFormat, null, "  ")}

入力ファイルの例:

${JSON.stringify(example, null, "  ")}

詳細は
Prisma.accountsCreateInput https://docs.originator-profile.org/ts/types/_originator_profile_registry_db.default.Prisma.accountsCreateInput.html\
 または \
Prisma.accountsUpdateInput https://docs.originator-profile.org/ts/types/_originator_profile_registry_db.default.Prisma.accountsUpdateInput.html\
 をご確認ください。`,
      default: "account.example.json",
      required: true,
    }),
    operation: operation(),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Account);
    const services = Services({
      config: { ISSUER_UUID: process.env.ISSUER_UUID ?? "" },
    });
    const inputBuffer = await fs.readFile(flags.input);
    const input = JSON.parse(inputBuffer.toString());
    const operation = flags.operation as
      | "create"
      | "read"
      | "update"
      | "delete";
    if (typeof input.id === "string") {
      input.id = parseAccountId(input.id);
    }
    const data = await services.account[operation](input);
    this.log(JSON.stringify(data, null, 2));
  }
}
