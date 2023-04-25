import { Flags } from "@oclif/core";
import { validate, v5 as uuid5 } from "uuid";

/**
 * 会員 ID またはドメイン名の解析
 * @param uuidOrDns UUID 文字列表現 (RFC 4122) またはドメイン名 (RFC 4501)
 * @return UUID 文字列表現
 */
export function parseAccountId(uuidOrDns: string): string {
  uuidOrDns = uuidOrDns.toLowerCase();

  if (uuidOrDns.startsWith("urn:uuid:") || validate(uuidOrDns)) {
    const uuid = uuidOrDns.replace(/^urn:uuid:/, "");
    return uuid;
  }

  const dns = uuidOrDns.replace(/^dns:/, "");
  return uuid5(dns, uuid5.DNS);
}

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
