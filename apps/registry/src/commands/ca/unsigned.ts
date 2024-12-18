import { Command, Flags } from "@oclif/core";
import type {
  RawTarget,
  UnsignedContentAttestation,
} from "@originator-profile/model";
import { Services } from "@originator-profile/registry-service";
import fs from "node:fs/promises";
import { expirationDate } from "../../flags";

const exampleArticleContentAttestation = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
      "@language": "<言語・地域コード>",
    },
  ],
  type: ["VerifiableCredential", "ContentAttestation"],
  issuer: "<OP ID>",
  credentialSubject: {
    id: "<CA ID>",
    type: "Article",
    headline: "<コンテンツのタイトル>",
    description: "<コンテンツの説明>",
    image: {
      id: "<サムネイル画像URL>",
    },
    datePublished: "<公開日時>",
    dateModified: "<最終更新日時>",
    author: ["<著者名>"],
    editor: ["<編集者名>"],
    genre: "<ジャンル>",
  },
  allowedUrl: "<CAの使用を許可するWebページのURL Pattern>",
  target: [
    {
      type: "<Target Integrityの種別>" as RawTarget["type"],
      content: "<コンテンツ本体 (text/html or URL)>",
      cssSelector: "<CSS セレクター (optional)>",
    },
  ],
} satisfies UnsignedContentAttestation;

export class CaUnsigned extends Command {
  static summary = "未署名 Content Attestation の取得";
  static description = `\
標準出力に未署名 Content Attestation を出力します。
target[].integrity を省略した場合、type に準じて content から integrity を計算します。
一方、target[].integrity が含まれる場合、その値をそのまま使用します。
なお、いずれも target[].content プロパティが削除される点にご注意ください。
これにより入力ファイルの target[] と異なる結果が含まれますが、これは正しい動作です。`;
  static flags = {
    input: Flags.string({
      summary: "入力ファイルのパス (JSON 形式)",
      helpValue: "<filepath>",
      description: `\
Article Content Attestation の例:

${JSON.stringify(exampleArticleContentAttestation, null, "  ")}`,
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
    --input article-content-attestation.example.json`,
  ];

  async run(): Promise<void> {
    const { flags } = await this.parse(CaUnsigned);
    const inputBuffer = await fs.readFile(flags.input);

    const input: UnsignedContentAttestation = JSON.parse(
      inputBuffer.toString(),
    );

    const uca = await Services().publisher.unsignedCa(input, {
      issuedAt: flags["issued-at"],
      expiredAt: flags["expired-at"],
    });

    this.logJson(uca);
  }
}
