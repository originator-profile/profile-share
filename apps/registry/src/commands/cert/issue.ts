import { Command, Flags } from "@oclif/core";
import { addYears } from "date-fns";
import { Services } from "@originator-profile/registry-service";
import { accountId, expirationDate, privateKey } from "../../flags";

const config = { ISSUER_UUID: process.env.ISSUER_UUID ?? "" };

export class CertIssue extends Command {
  static description = "OP の発行";
  static flags = {
    identity: privateKey({ required: true }),
    issuer: accountId({
      summary: "OP 発行機関の ID またはドメイン名",
      aliases: ["certifier"],
      required: true,
    }),
    holder: accountId({
      summary: "所有者となる会員 ID またはドメイン名",
      required: true,
    }),
    "issued-at": Flags.string({
      description: "発行日時 (ISO 8601)",
    }),
    "expired-at": expirationDate(),
    "valid-at": Flags.string({
      description:
        "この日時に既に失効している資格情報を含めない。デフォルトは issued-at と同じ日時。",
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(CertIssue);
    const services = Services({ config });
    const isCertifier = await services.certificate.isCertifier(flags.issuer);
    if (!isCertifier) this.error("Invalid issuer.");
    const jwk = flags.identity;
    const issuedAt = flags["issued-at"]
      ? new Date(flags["issued-at"])
      : new Date();
    const expiredAt = flags["expired-at"] ?? addYears(new Date(), 1);
    const validAt = flags["valid-at"] ? new Date(flags["valid-at"]) : issuedAt;

    const jwt = await services.certificate.signOp(
      flags.issuer,
      flags.holder,
      jwk,
      { issuedAt, expiredAt, validAt },
    );

    const opId = await services.certificate.issue(flags.issuer, jwt);

    await services.account.publishProfile(flags.holder, opId);

    this.log("Published.");
  }
}
