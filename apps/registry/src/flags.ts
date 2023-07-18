import { Flags } from "@oclif/core";
import { parseAccountId } from "@originator-profile/core";
import { Jwk } from "@originator-profile/model";
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
    const jwk = JSON.parse(fileContent);
    // TODO: 正しい JWK か検証
    return jwk;
  }
})
