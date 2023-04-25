import { Command, Flags } from "@oclif/core";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs/promises";
import { addYears } from "date-fns";
import { Services } from "@webdino/profile-registry-service";
import { accountId } from "../../flags";

const config = { ISSUER_UUID: process.env.ISSUER_UUID ?? "" };

export class CertIssue extends Command {
  static description = "OP の発行";
  static flags = {
    identity: Flags.string({
      char: "i",
      description: "PEM base64 でエンコードされた PKCS #8 秘密鍵ファイル",
      required: true,
    }),
    certifier: accountId({
      summary: "認証機関 ID またはドメイン名",
      required: true,
    }),
    holder: accountId({
      summary: "所有者となる会員 ID またはドメイン名",
      required: true,
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
    const services = Services({ config, prisma });
    const isCertifier = await services.certificate.isCertifier(flags.certifier);
    if (isCertifier instanceof Error) this.error(isCertifier);
    if (!isCertifier) this.error("Invalid certifier.");

    const pkcs8File = await fs.readFile(flags.identity);
    const pkcs8 = pkcs8File.toString();
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
      { issuedAt, expiredAt }
    );
    if (jwt instanceof Error) this.error(jwt);

    const opId = await services.certificate.issue(flags.certifier, jwt);
    if (opId instanceof Error) this.error(opId);

    const data = await services.account.publishProfile(flags.holder, opId);
    if (data instanceof Error) this.error(data);
    this.log("Published.");
  }
}
