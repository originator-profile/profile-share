import { Command, Flags } from "@oclif/core";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs/promises";
import { addYears } from "date-fns";
import { Services } from "@webdino/profile-registry-service";

const config = {
  ISSUER_UUID: process.env.ISSUER_UUID ?? "",
  JSONLD_CONTEXT:
    process.env.JSONLD_CONTEXT ??
    "https://github.com/webdino/profile-registry/blob/master/contexts/profile.jsonld",
};

export class CertIssue extends Command {
  static description = "OP の発行";
  static flags = {
    identity: Flags.string({
      char: "i",
      description: "PEM base64 でエンコードされた PKCS #8 秘密鍵ファイル",
      required: true,
    }),
    certifier: Flags.string({
      description: "認証機構 (UUID)",
      required: true,
    }),
    holder: Flags.string({
      description: "発行対象の会員 (UUID)",
      required: true,
    }),
    credential: Flags.string({
      description: "認証機構の報告書 JSON ファイル",
    }),
    "issued-at": Flags.string({
      description: "発行日時 (ISO 8601)",
    }),
    "expired-at": Flags.string({
      description: "有効期限 (ISO 8601)",
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(CertIssue);
    const prisma = new PrismaClient();
    const services = Services({
      config,
      prisma,
    });

    const isCertifier = await services.certificate.isCertifier(flags.certifier);
    if (isCertifier instanceof Error) this.error(isCertifier);
    if (!isCertifier) this.error("Invalid certifier.");

    const pkcs8File = await fs.readFile(flags.identity);
    const pkcs8 = pkcs8File.toString();
    const credentialFile = flags.credential
      ? await fs.readFile(flags.credential)
      : undefined;
    const credential = credentialFile
      ? JSON.parse(credentialFile.toString())
      : {};
    const issuedAt = flags["issued-at"]
      ? new Date(flags["issued-at"])
      : new Date();
    const expiredAt = flags["expired-at"]
      ? new Date(flags["expired-at"])
      : addYears(new Date(), 1);
    const jwt = await services.certificate.signOp(
      flags.certifier,
      flags.holder,
      pkcs8,
      { issuedAt, expiredAt, credential }
    );
    if (jwt instanceof Error) this.error(jwt);

    const opId = await services.certificate.issue(flags.certifier, jwt);
    if (opId instanceof Error) this.error(opId);

    const data = await services.account.publishProfile(flags.holder, opId);
    if (data instanceof Error) this.error(data);
    this.log("Published.");
  }
}
