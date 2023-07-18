import { Flags } from "@oclif/core";
import { parseAccountId } from "@originator-profile/core";

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
