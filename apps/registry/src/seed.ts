import util from "node:util";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs/promises";
import { Services } from "@originator-profile/registry-service";
import exampleAccount from "./account.example.json";
import exampleWebsite from "./website.example.json";
import exampleCategories from "./category.example.json";
import { Jwk } from "@originator-profile/model";
import addYears from "date-fns/addYears";
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
  const data = await services.account.registerKey(issuerUuid, publicKey);
  if (data instanceof Error) throw data;
  const jwt = await services.certificate.signOp(
    issuerUuid,
    issuerUuid,
    privateKey,
  );
  if (jwt instanceof Error) throw jwt;
  const opId = await services.certificate.issue(issuerUuid, jwt);
  if (opId instanceof Error) throw opId;
  await services.account.publishProfile(issuerUuid, opId);
  console.log(`Profile: ${jwt}
Public Key: ${JSON.stringify(publicKey)}

${privateKey}`);
}

async function issueDp(
  services: Services,
  issuerUuid: string,
  privateKey: Jwk,
) {
  const count = await services.category.createMany(exampleCategories);
  if (count instanceof Error) throw count;
  const exampleCategory = Array.isArray(exampleCategories)
    ? exampleCategories[0]
    : exampleCategories;

  const { body, ...input } = exampleWebsite;
  const proofJws = await services.website.signBody(privateKey, body);
  if (proofJws instanceof Error) throw proofJws;
  const website = await services.website.create({
    ...input,
    accountId: issuerUuid,
    categories: [
      exampleCategory && {
        cat: exampleCategory.cat,
        cattax: exampleCategory.cattax,
      },
    ],
    proofJws,
  });
  if (website instanceof Error) throw website;
  const dpJwt = await services.publisher.signDp(
    issuerUuid,
    input.id,
    privateKey,
  );
  if (dpJwt instanceof Error) throw dpJwt;
  await services.publisher.registerDp(issuerUuid, dpJwt);
  console.log(`Document Profile: ${dpJwt}`);
}

export async function seed(): Promise<void> {
  const issuerUuid: string =
    process.env.ISSUER_UUID ?? "cd8f5f9f-e3e8-569f-87ef-f03c6cfc29bc";
  const appUrl: string = process.env.APP_URL ?? "http://localhost:8080";
  const services = Services({
    config: { ISSUER_UUID: issuerUuid, APP_URL: appUrl },
  });

  await waitForDb(prisma);

  const issuerExists = await services.account.read({ id: issuerUuid });
  if (issuerExists instanceof Error) {
    await services.account.create({ id: issuerUuid, ...exampleAccount });
    const certifier = parseAccountId(exampleAccount.domainName);
    await services.credential.create(
      issuerUuid,
      certifier,
      certifier,
      "ブランドセーフティ認証",
      new Date(),
      addYears(new Date(), 1),
      new URL("/certification-system.example.json", process.env.APP_URL).href,
      new URL("/credential-brand-safety-certified.png", process.env.APP_URL)
        .href,
    );
  }
  console.log(`UUID: ${issuerUuid}`);

  const accountKeys = await services.account.getKeys(issuerUuid);
  if ("keys" in accountKeys && accountKeys.keys.length === 0) {
    const jwk = await fs
      .readFile("./account-key.example.pub.json")
      .then((buffer) => JSON.parse(buffer.toString()));
    const privateKeyText = await fs
      .readFile("./account-key.example.priv.json")
      .then((buffer) => buffer.toString());
    const privateKey: Jwk = JSON.parse(privateKeyText);
    await issueOp(services, issuerUuid, jwk, privateKey);

    const websiteExists = await services.website.read(exampleWebsite);
    if (websiteExists instanceof Error) {
      await issueDp(services, issuerUuid, privateKey);
    }
  }
}

if (require.main === module) seed();
