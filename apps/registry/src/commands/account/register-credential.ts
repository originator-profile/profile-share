import { Command, Flags } from "@oclif/core";
import { PrismaClient, Prisma } from "@prisma/client";
import { addYears } from "date-fns";
import { Services } from "@webdino/profile-registry-service";
import { accountId } from "../../flags";

const config = { ISSUER_UUID: process.env.ISSUER_UUID ?? "" };

export class RegisterCredential extends Command {
  static description = "資格情報を登録します";
  static flags = {
    id: accountId({
      summary: "アカウントの ID またはドメイン名",
      required: true,
    }),
    certifier: accountId({
      summary: "認証機関の ID またはドメイン名",
      required: true,
    }),
    verifier: accountId({
      summary: "検証期間の ID またはドメイン名",
      required: true,
    }),
    name: Flags.string({
      description: "資格名",
      required: true,
    }),
    image: Flags.url({
      description: "画像URL",
    }),
    "issued-at": Flags.string({
      description: "発行日時 (ISO 8601)",
    }),
    "expired-at": Flags.string({
      description: "有効期限 (ISO 8601)",
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(RegisterCredential);
    const prisma = new PrismaClient();
    const services = Services({ config, prisma });
    const isCertifier = await services.certificate.isCertifier(flags.certifier);
    if (isCertifier instanceof Error) this.error(isCertifier);
    if (!isCertifier) this.error("Invalid certifier.");

    const issuedAt = flags["issued-at"]
      ? new Date(flags["issued-at"])
      : new Date();
    const expiredAt = flags["expired-at"]
      ? new Date(flags["expired-at"])
      : addYears(new Date(), 1);

    const result = await services.credential.create(
      flags.id,
      flags.certifier,
      flags.verifier,
      flags.name,
      issuedAt,
      expiredAt,
      flags.image?.toString(),
    );

    console.log(JSON.stringify(result, null, 2));
  }
}
