import { Command, Flags } from "@oclif/core";
import type {
  CoreProfile,
  Image,
  WebMediaProfile,
  WebsiteProfile,
} from "@originator-profile/model";
import { signVc } from "@originator-profile/sign";
import { addYears } from "date-fns";
import fs from "node:fs/promises";
import { createIntegrityMetadata } from "websri";
import { expirationDate, opId, privateKey } from "../flags";

type MinVC = CoreProfile | WebMediaProfile | WebsiteProfile;

function isValidVc(vc: unknown): vc is MinVC {
  /* 完全な整合性まではチェックしないが、credentialSubject はあるはず */
  return (
    typeof vc === "object" &&
    vc !== null &&
    "credentialSubject" in vc &&
    typeof vc.credentialSubject === "object" &&
    vc.credentialSubject !== null
  );
}

async function fetchAndSetDigestSri<
  T extends Record<string, unknown>,
  Key extends "logo" | "image",
>(obj: T, key: Key): Promise<void> {
  if (key in obj && typeof (obj[key] as Image).digestSRI !== "string") {
    const res = await fetch((obj[key] as Image).id);
    const data = await res.arrayBuffer();
    const meta = await createIntegrityMetadata("sha256", data);

    (obj[key] as Image).digestSRI = meta.toString();
  }
}

async function addDigestSri(vc: unknown) {
  if (!isValidVc(vc)) throw new Error("Invalid VC");

  const credentialSubject = vc.credentialSubject;

  await fetchAndSetDigestSri(credentialSubject, "logo");
  await fetchAndSetDigestSri(credentialSubject, "image");

  return Object.assign(vc, { credentialSubject });
}

const exampleCoreProfile = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    { "@language": "ja" },
  ],
  type: ["VerifiableCredential", "CoreProfile"],
  issuer: "dns:example.org",
  credentialSubject: {
    id: "dns:example.jp",
    type: "Core",
    jwks: {
      keys: [
        {
          kid: "LIstkoCvByn4jk8oZPvigQkzTzO9UwnGnE-VMlkZvYQ",
          kty: "EC",
          crv: "P-256",
          x: "QiVI-I-3gv-17KN0RFLHKh5Vj71vc75eSOkyMsxFxbE",
          y: "bEzRDEy41bihcTnpSILImSVymTQl9BQZq36QpCpJQnI",
        },
      ],
    },
  },
} satisfies CoreProfile;

const exampleWebsiteProfile = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    { "@language": "ja" },
  ],
  type: ["VerifiableCredential", "WebsiteProfile"],
  issuer: "dns:example.com",
  credentialSubject: {
    id: "https://media.example.com/",
    type: "WebSite",
    name: "<Webサイトのタイトル>",
    description: "<Webサイトの説明>",
    image: {
      id: "https://media.example.com/image.png",
      digestSRI: "sha256-Upwn7gYMuRmJlD1ZivHk876vXHzokXrwXj50VgfnMnY=",
    },
    url: "https://media.example.com",
  },
} satisfies WebsiteProfile;

const exampleWebMediaProfile = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    { "@language": "ja" },
  ],
  type: ["VerifiableCredential", "WebMediaProfile"],
  issuer: "dns:wmp-issuer.example.org",
  credentialSubject: {
    id: "dns:wmp-holder.example.jp",
    type: "OnlineBusiness",
    url: "https://www.wmp-holder.example.jp/",
    name: "○○メディア (※開発用サンプル)",
    logo: {
      id: "https://www.wmp-holder.example.jp/image.png",
      digestSRI: "sha256-Upwn7gYMuRmJlD1ZivHk876vXHzokXrwXj50VgfnMnY=",
    },
    email: "contact@wmp-holder.example.jp",
    telephone: "0000000000",
    contactTitle: "お問い合わせ",
    contactUrl: "https://wmp-holder.example.jp/contact",
    privacyPolicyTitle: "プライバシーポリシー",
    privacyPolicyUrl: "https://wmp-holder.example.jp/privacy",
    publishingPrincipleTitle: "新聞倫理綱領",
    publishingPrincipleUrl: "https://wmp-holder.example.jp/statement",
    description: {
      type: "PlainTextDescription",
      data: "この文章はこの Web メディアに関する補足情報です。",
    },
  },
} satisfies WebMediaProfile;

export class VcSign extends Command {
  static summary = "VC の作成";
  static description = `\
VC に署名します。
標準出力に VC を出力します。`;
  static flags = {
    identity: privateKey({ required: true }),
    id: opId({
      required: true,
    }),
    input: Flags.string({
      summary: "入力ファイルのパス (JSON 形式)",
      helpValue: "<filepath>",
      description: `\
コアプロファイル (CP) の例:

${JSON.stringify(exampleCoreProfile, null, "  ")}

ウェブサイトプロファイル (WSP) の例:

${JSON.stringify(exampleWebsiteProfile, null, "  ")}

ウェブメディアプロファイル (WMP) の例:

${JSON.stringify(exampleWebMediaProfile, null, "  ")}`,
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
    -i example.priv.json \\
    --id example.com \\
    --input core-profile.json`,
    `\
$ <%= config.bin %> <%= command.id %> \\
    -i example.priv.json \\
    --id www.example.com \\
    --input website-profile.json`,
    `\
    $ <%= config.bin %> <%= command.id %> \\
        -i example.priv.json \\
        --id example.org \\
        --input web-media-profile.json`,
  ];

  async run(): Promise<void> {
    const { flags } = await this.parse(VcSign);
    const opId = flags.id;
    const inputBuffer = await fs.readFile(flags.input);
    const input = JSON.parse(inputBuffer.toString());
    input.credentialSubject.id = opId;
    const privateKey = flags.identity;

    const issuedAt = flags["issued-at"]
      ? new Date(flags["issued-at"])
      : new Date();
    const expiredAt = flags["expired-at"] ?? addYears(new Date(), 1);
    const data = (await addDigestSri(input)) as MinVC;
    const vc = await signVc(data, privateKey, {
      issuedAt,
      expiredAt,
    });
    this.log(vc);
  }
}
