import { Command, Flags } from "@oclif/core";
import type { WebsiteProfile } from "@originator-profile/model";
import { Services } from "@originator-profile/registry-service";
import fs from "node:fs/promises";
import { expirationDate } from "../../flags";

const exampleWebsiteProfile = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
      "@language": "<言語・地域コード>",
    },
  ],
  type: ["VerifiableCredential", "WebsiteProfile"],
  issuer: "<OP ID>",
  credentialSubject: {
    id: "<Web サイトの URL>",
    url: "<Web サイトの URL>",
    type: "WebSite",
    name: "<Web サイトの名称>",
    description: "<Web サイトの説明>",
    image: {
      id: "<サムネイル画像URL>",
    },
  },
} satisfies WebsiteProfile;

export class WpUnsigned extends Command {
  static summary = "未署名 Website Profile の取得";
  static description = "標準出力に未署名 Website Profile を出力します。";
  static flags = {
    input: Flags.string({
      summary: "入力ファイルのパス (JSON 形式)",
      helpValue: "<filepath>",
      description: `\
Website Profile の例:

${JSON.stringify(exampleWebsiteProfile, null, "  ")}`,
      required: true,
    }),
    "issued-at": Flags.string({
      description: "発行日時 (ISO 8601)",
    }),
    "expired-at": expirationDate(),
  };
  static examples = [
    `\
$ <%= config.bin %> <%= command.id %> \\
    --input website-profile.example.json`,
  ];

  async run(): Promise<void> {
    const { flags } = await this.parse(WpUnsigned);
    const inputBuffer = await fs.readFile(flags.input);

    const input: WebsiteProfile = JSON.parse(inputBuffer.toString());

    const uwp = await Services().publisher.unsignedWp(input, {
      issuedAt: flags["issued-at"],
      expiredAt: flags["expired-at"],
    });

    this.logJson(uwp);
  }
}
