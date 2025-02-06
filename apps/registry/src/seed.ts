import util from "node:util";
import fs from "node:fs/promises";
import { isHttpError } from "http-errors-enhanced";
import { PrismaClient } from "@prisma/client";
import { Services } from "@originator-profile/registry-service";
import exampleAccount from "./account.example.json";
import { Jwk } from "@originator-profile/model";
import { addYears } from "date-fns/addYears";
import { parseAccountId } from "@originator-profile/core";
import { prisma } from "@originator-profile/registry-db";

export async function waitForDb(prisma: PrismaClient): Promise<void> {
  const sleep = util.promisify(setTimeout);

  for (;;) {
    try {
      await prisma.$connect();
      break;
    } catch {
      console.log("Waiting for database to be ready...");
      await sleep(1_000);
    }
  }
}

async function issueOp(
  services: Services,
  issuerUuid: string,
  publicKey: Jwk,
  privateKey: Jwk,
) {
  await services.account.registerKey(issuerUuid, publicKey);

  const jwt = await services.certificate.signOp(
    issuerUuid,
    issuerUuid,
    privateKey,
  );

  const opId = await services.certificate.issue(issuerUuid, jwt);

  await services.account.publishProfile(issuerUuid, opId);

  console.log(`Profile: ${jwt}
Public Key: ${JSON.stringify(publicKey)}
${JSON.stringify(privateKey)}`);
}

export async function seed(): Promise<void> {
  const issuerUuid: string =
    process.env.ISSUER_UUID ?? "cd8f5f9f-e3e8-569f-87ef-f03c6cfc29bc";
  const appUrl: string = process.env.APP_URL ?? "http://localhost:8080";
  const services = Services({
    config: { ISSUER_UUID: issuerUuid, APP_URL: appUrl },
  });

  await waitForDb(prisma);

  const issuerExists = await services.account
    .read({ id: issuerUuid })
    .catch((e) => e);
  if (isHttpError(issuerExists) && issuerExists.status === 404) {
    await services.account.create({ ...exampleAccount, id: issuerUuid });
    const certifier = parseAccountId(exampleAccount.domainName);
    await services.credential.create(
      issuerUuid,
      certifier,
      certifier,
      "JICDAQ ブランドセーフティ認証 自己宣言",
      new Date(),
      addYears(new Date(), 1),
      new URL(
        "/certification-systems/95dceb6c-f6aa-4b70-aa5a-0ba9c31490ff",
        process.env.APP_URL,
      ).href,
      new URL("/credential-brand-safety-certified.png", process.env.APP_URL)
        .href,
    );
  }
  console.log(`UUID: ${issuerUuid}`);

  const accountKeys = await services.account.getKeys(issuerUuid);
  if (accountKeys.keys.length === 0) {
    const jwk = await fs
      .readFile("./account-key.example.pub.json")
      .then((buffer) => JSON.parse(buffer.toString()));
    const privateKeyText = await fs
      .readFile("./account-key.example.priv.json")
      .then((buffer) => buffer.toString());
    const privateKey: Jwk = JSON.parse(privateKeyText);
    await issueOp(services, issuerUuid, jwk, privateKey);
  }
}
if (require.main === module) void seed();
