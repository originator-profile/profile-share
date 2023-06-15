import util from "node:util";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs/promises";
import { Services } from "@webdino/profile-registry-service";
import exampleAccount from "./account.example.json";
import exampleWebsite from "./website.example.json";
import exampleCategory from "./category.example.json";
import { Jwk } from "@webdino/profile-model";
import addYears from "date-fns/addYears";
import { domainName2Uuid } from "@webdino/profile-core";

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
  jwk: Jwk,
  pkcs8: string
) {
  const data = await services.account.registerKey(issuerUuid, jwk);
  if (data instanceof Error) throw data;
  const jwt = await services.certificate.signOp(issuerUuid, issuerUuid, pkcs8);
  if (jwt instanceof Error) throw jwt;
  const opId = await services.certificate.issue(issuerUuid, jwt);
  if (opId instanceof Error) throw opId;
  await services.account.publishProfile(issuerUuid, opId);
  console.log(`Profile: ${jwt}
Public Key: ${JSON.stringify(jwk)}

${pkcs8}`);
}

async function issueDp(services: Services, issuerUuid: string, pkcs8: string) {
  const categoryExists = await services.category.read(exampleCategory);
  if (categoryExists instanceof Error) {
    await services.category.create(exampleCategory);
  }

  const { body, ...input } = exampleWebsite;
  const proofJws = await services.website.signBody(pkcs8, body);
  if (proofJws instanceof Error) throw proofJws;
  const website = await services.website.create({
    ...input,
    account: { connect: { id: issuerUuid } },
    categories: {
      create: {
        categoryCat: exampleCategory.cat,
        categoryCattax: exampleCategory.cattax,
      },
    },
    proofJws,
  });
  if (website instanceof Error) throw website;
  const dpJwt = await services.publisher.signDp(issuerUuid, input.url, pkcs8);
  if (dpJwt instanceof Error) throw dpJwt;
  await services.publisher.registerDp(issuerUuid, dpJwt);
  console.log(`Document Profile: ${dpJwt}`);
}

export async function seed(): Promise<void> {
  const issuerUuid: string =
    process.env.ISSUER_UUID ?? "cd8f5f9f-e3e8-569f-87ef-f03c6cfc29bc";
  const appUrl: string = process.env.APP_URL ?? "http://localhost:8080";
  const prisma: PrismaClient = new PrismaClient();
  const services = Services({
    config: { ISSUER_UUID: issuerUuid, APP_URL: appUrl },
    prisma,
  });

  await waitForDb(prisma);

  const issuerExists = await services.account.read({ id: issuerUuid });
  if (issuerExists instanceof Error) {
    await services.account.create({ id: issuerUuid, ...exampleAccount });
    const certifier = domainName2Uuid(exampleAccount.domainName);
    await services.credential.create(
      issuerUuid,
      certifier,
      certifier,
      "ブランドセーフティ認証",
      new Date(),
      addYears(new Date(), 1)
    );
  }
  console.log(`UUID: ${issuerUuid}`);

  const accountKeys = await services.account.getKeys(issuerUuid);
  if ("keys" in accountKeys && accountKeys.keys.length === 0) {
    const jwk = await fs
      .readFile("./account-key.example.pem.pub.json")
      .then((buffer) => JSON.parse(buffer.toString()));
    const pkcs8 = await fs
      .readFile("./account-key.example.pem")
      .then((buffer) => buffer.toString());
    await issueOp(services, issuerUuid, jwk, pkcs8);

    const websiteExists = await services.website.read(exampleWebsite);
    if (websiteExists instanceof Error) {
      await issueDp(services, issuerUuid, pkcs8);
    }
  }
}

if (require.main === module) seed();
