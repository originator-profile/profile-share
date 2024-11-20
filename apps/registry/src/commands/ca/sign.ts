import { Command, Flags } from "@oclif/core";
import type {
  ArticleCA,
  ContentAttestation,
  Image,
  Jwk,
} from "@originator-profile/model";
import { createDigestSri, signCa } from "@originator-profile/sign";
import { addYears } from "date-fns";
import { Window } from "happy-dom";
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
      type: "TextTargetIntegrity",
      cssSelector: "<CSS セレクター>",
      integrity: "<省略可能>",
    },
    {
      type: "ExternalResourceTargetIntegrity",
      integrity: "sha256-+M3dMZXeSIwAP8BsIAwxn5ofFWUtaoSoDfB+/J8uXMo=",
    },
  ],
} satisfies ContentAttestation;

async function fetchAndSetDigestSri<T extends Record<string, unknown>>(
  obj: T,
): Promise<void> {
  if ("image" in obj && typeof (obj.image as Image).digestSRI !== "string") {
    Object.assign(
      obj.image as Image,
      await createDigestSri("sha256", obj.image as Image),
    );
  }
}

async function scrapeAndSignCa(
  url: string,
  ca: ContentAttestation,
  opts: {
    privateKey: Jwk;
    issuedAt: Date;
    expiredAt: Date;
  },
): Promise<string> {
  const res = await fetch(url);
  const html = await res.text();

  const window = new Window({
    url,
  });

  window.document.write(html);

  return await signCa(ca as ArticleCA, opts.privateKey, {
    issuedAt: opts.issuedAt,
    expiredAt: opts.expiredAt,
    document: window.document as unknown as Document,
  });
}

export class CaSign extends Command {
  static summary = "Content Attestation の作成";
  static description = "標準出力に Content Attestation を出力します。";
  static flags = {
    url: Flags.string({
      summary: "取得するウェブページの URL",
      required: true,
    }),
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
    --url https://example.com/ \\
    -i account-key.example.priv.json \\
    --input article-content-attestation.example.json`,
  ];

  async run(): Promise<void> {
    const { flags } = await this.parse(CaSign);
    const inputBuffer = await fs.readFile(flags.input);
    const input: ContentAttestation = JSON.parse(inputBuffer.toString());
    const issuedAt: Date = new Date(flags["issued-at"] ?? Date.now());
    const expiredAt: Date = flags["expired-at"] ?? addYears(new Date(), 1);

    Object.assign(input.credentialSubject, {
      id: input.credentialSubject.id ?? `urn:uuid:${crypto.randomUUID()}`,
    });

    await fetchAndSetDigestSri(input.credentialSubject);

    const ca = await scrapeAndSignCa(flags.url, input, {
      privateKey: flags.identity,
      issuedAt,
      expiredAt,
    });

    this.log(ca);
  }
}
