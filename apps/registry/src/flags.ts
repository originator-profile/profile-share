import { Flags } from "@oclif/core";
import { parseAccountId, parseExpirationDate } from "@originator-profile/core";
import { Jwk } from "@originator-profile/model";
import { importPKCS8, exportJWK } from "jose";
import fs from "node:fs/promises";

export const accountId = Flags.custom<string>({
  summary: "会員 ID またはドメイン名",
  description: `\
UUID 文字列表現 (RFC 4122) またはドメイン名 (RFC 4501) を指定します。`,
  async parse(uuidOrDns: string): Promise<string> {
    return parseAccountId(uuidOrDns);
  },
});

export const operation = Flags.custom<"create" | "read" | "update" | "delete">({
  char: "o",
  description: "操作",
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
