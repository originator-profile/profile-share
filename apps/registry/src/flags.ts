import { Flags } from "@oclif/core";
import { parseAccountId, parseExpirationDate } from "@originator-profile/core";
import { Jwk } from "@originator-profile/model";
import { importPKCS8, exportJWK } from "jose";
import fs from "node:fs/promises";

export const accountId = Flags.custom<string>({
  summary: "会員 ID またはドメイン名",
  description: `\
UUID 文字列表現 (RFC 9562) またはドメイン名 (RFC 4501) を指定します。`,
  async parse(uuidOrDns: string): Promise<string> {
    return parseAccountId(uuidOrDns);
  },
});

export const operation = Flags.custom<"create" | "read" | "update" | "delete">({
  char: "o",
  summary: "操作",
  description: `\
  操作を指定します。

  read, update, delete を指定した場合、--input で指定した JSON ファイルの中に id を必ず含めてください。
  create の場合、id を省略できます。その場合 id は自動的に生成されます。
  `,
  options: ["create", "read", "update", "delete"],
  required: true,
});

export const privateKey = Flags.custom({
  char: "i",
  summary: "プライベート鍵のファイルパス",
  description:
    "プライベート鍵のファイルパスを渡してください。プライベート鍵は JWK 形式か、PEM base64 でエンコードされた PKCS #8 形式にしてください。",
  async parse(filepath: string): Promise<Jwk> {
    const buffer = await fs.readFile(filepath);
    const fileContent = buffer.toString();
    try {
      const key = await importPKCS8(fileContent, "ES256");
      const jwk = await exportJWK(key);
      return jwk as Jwk;
    } catch (e: unknown) {
      return JSON.parse(fileContent);
    }
  },
});

export const expirationDate = Flags.custom<Date>({
  summary: "有効期限 (ISO 8601)",
  description:
    "日付のみの場合、その日の 24:00:00.000 より前まで有効、それ以外の場合、期限切れとなる日付・時刻・秒を指定します。",
  async parse(input: string): Promise<Date> {
    return parseExpirationDate(input);
  },
});

export const allowedOrigins = Flags.custom<string[]>({
  summary: "許可する掲載先",
  helpValue: "<origins>",
  description: `\
掲載先を許可するために使用されます。
URL オリジン "https://<ホスト>" 形式で指定します。
複数指定する場合はコンマ "," で区切ります。
"*" は任意の掲載先での利用の許可を意味します。

例1: "*"
例2: "https://example.com,https://www.example.com"
`,
  async parse(input: string): Promise<string[]> {
    return input.split(",");
  },
});
