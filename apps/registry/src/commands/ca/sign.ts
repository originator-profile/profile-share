import { Command, Flags } from "@oclif/core";
import type {
  RawTarget,
  UnsignedContentAttestation,
} from "@originator-profile/model";
import { Services } from "@originator-profile/registry-service";
import fs from "node:fs/promises";
import { expirationDate, privateKey } from "../../flags";

const exampleArticleContentAttestation = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
      "@language": "ja",
    },
  ],
  type: ["VerifiableCredential", "ContentAttestation"],
  issuer: "dns:example.com",
  credentialSubject: {
    id: "urn:uuid:78550fa7-f846-4e0f-ad5c-8d34461cb95b",
    type: "Article",
    headline: "<Webページのタイトル>",
    image: {
      id: "https://media.example.com/image.png",
    },
    description: "<Webページの説明>",
    author: ["山田花子"],
    editor: ["山田太郎"],
    datePublished: "2023-07-04T19:14:00Z",
    dateModified: "2023-07-04T19:14:00Z",
    genre: "Arts & Entertainment",
  },
  allowedUrl: "https://media.example.com/articles/2024-06-30",
  target: [
    {
      type: "<Target Integrityの種別>" as RawTarget["type"],
      content: "<コンテンツ本体 (text/html or URL)>",
      cssSelector: "<CSS セレクター (optional)>",
    },
  ],
} satisfies UnsignedContentAttestation;

export class CaSign extends Command {
  static summary = "Content Attestation の作成";
  static description = "標準出力に Content Attestation を出力します。";
  static flags = {
    identity: privateKey({
      required: true,
    }),
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
    -i account-key.example.priv.json \\
    --input article-content-attestation.example.json`,
  ];

  async run(): Promise<void> {
    const { flags } = await this.parse(CaSign);
    const inputBuffer = await fs.readFile(flags.input);

    const input: UnsignedContentAttestation = JSON.parse(
      inputBuffer.toString(),
    );

    const ca = await Services().publisher.sign(input, flags.identity, {
      issuedAt: flags["issued-at"],
      expiredAt: flags["expired-at"],
    });

    this.log(ca);
  }
}
