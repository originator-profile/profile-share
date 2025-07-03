import { Flags } from "@oclif/core";
import { parseExpirationDate } from "@originator-profile/core";
import { Jwk } from "@originator-profile/model";
import { exportJWK, importPKCS8 } from "jose";
import fs from "node:fs/promises";

export const opId = Flags.custom<string>({
  summary: "OP ID (ドメイン名)",
  description: `\
ドメイン名 (RFC 4501) を指定します。`,
  async parse(domainName: string): Promise<string> {
    const id = domainName.toLowerCase();
    return domainName.startsWith("dns:") ? id : `dns:${id}`;
  },
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
      const key = await importPKCS8(fileContent, "ES256", {
        extractable: true,
      });

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
