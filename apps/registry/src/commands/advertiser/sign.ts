import { Command, Flags } from "@oclif/core";
import { addYears } from "date-fns";
import flush from "just-flush";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import {
  expirationDate,
  privateKey,
  allowedOrigins as allowedOriginsFlag,
} from "../../flags";
import {
  Dp,
  type Advertisement as AdvertisementType,
} from "@originator-profile/model";
import { signBody, signDp } from "@originator-profile/sign";

type Advertisement = AdvertisementType & {
  id?: string;
  body?: string;
  bodyFormat?: string;
  location?: string;
  allowedOrigins?: string[];
};

const example: Omit<Advertisement, "type"> = {
  url: "https://example.com/",
  location: "h1",
  bodyFormat: "visibleText",
  body: "広告テキスト",
  title: "広告タイトル",
  image: "https://example.com/image.png",
  description: "この広告の説明です。",
};

export class AdvertiserSign extends Command {
  static summary = "Signed Advertisement Profile (SAP) の生成";
  static description = `\
広告の情報 (AP) に対して署名を行います。
署名済み AP (SAP) を生成し、それを標準出力に出力します。`;
  static flags = {
    identity: privateKey({ required: true }),
    id: Flags.string({
      summary: "OP ID (ドメイン名)",
      description: "ドメイン名 (RFC 4501) を指定します。",
      required: true,
    }),
    input: Flags.string({
      summary: "入力ファイルのパス (JSON 形式)",
      helpValue: "<filepath>",
      description: `\
入力ファイルの例:

${JSON.stringify(example, null, "  ")}`,
      required: true,
    }),
    "issued-at": Flags.string({
      description: "発行日時 (ISO 8601)",
    }),
    "expired-at": expirationDate(),
    "allowed-origins": allowedOriginsFlag({ required: false }),
  };
  static examples = [
    `\
$ <%= config.bin %> <%= command.id %> \\
    -i example.priv.json \\
    --id ad.example.com \\
    --allowed-origins '*' \\
    --input ad.json`,
  ];

  async run(): Promise<void> {
    const { flags } = await this.parse(AdvertiserSign);
    const domainName = flags.id.toLowerCase().replace(/^dns:/, "");
    const inputBuffer = await fs.readFile(flags.input);
    const { body, ...input } = JSON.parse(
      inputBuffer.toString(),
    ) as Advertisement;
    const privateKey = flags.identity;

    const allowedOrigins = flags["allowed-origins"] || input.allowedOrigins;

    if (!allowedOrigins) {
      this.error("allowedOrigins is not specified.");
    }

    // body に署名して proofJws パラメータを生成
    const proofJws = await signBody(body || "", privateKey);

    const issuedAt = flags["issued-at"]
      ? new Date(flags["issued-at"])
      : new Date();
    const expiredAt = flags["expired-at"] ?? addYears(new Date(), 1);
    const dp = {
      type: "dp",
      issuer: domainName,
      subject: input.id ?? crypto.randomUUID(),
      issuedAt: issuedAt.toISOString(),
      expiredAt: expiredAt.toISOString(),
      item: [
        {
          type: "advertisement",
          ...flush({
            url: input.url,
            title: input.title,
            image: input.image,
            description: input.description,
          }),
        },
        {
          type: input.bodyFormat as "visibleText" | "text" | "html",
          url: input.url,
          location: input.location,
          proof: { jws: proofJws },
        },
      ],
      allowedOrigins,
    } satisfies Dp;
    const sdp = await signDp(dp, privateKey);
    this.log(sdp);
  }
}
