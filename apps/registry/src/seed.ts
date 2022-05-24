import util from "node:util";
import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import { Services } from "@webdino/profile-registry-service";
import { generateKey } from "@webdino/profile-sign";
import exampleAccount from "./account.example.json";
import exampleWebsite from "./website.example.json";

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

export async function seed(): Promise<void> {
  const issuerUuid: string = process.env.ISSUER_UUID ?? crypto.randomUUID();
  const prisma: PrismaClient = new PrismaClient();
  const services = Services({
    config: {
      ISSUER_UUID: issuerUuid,
      JSONLD_CONTEXT: "https://github.com/webdino/profile",
    },
    prisma,
  });

  await waitForDb(prisma);

  const issuerExists = await prisma.accounts.findUnique({
    where: { id: issuerUuid },
  });
  if (!issuerExists) {
    await prisma.accounts.create({
      data: { id: issuerUuid, ...exampleAccount },
    });
  }
  console.log(`UUID: ${issuerUuid}`);

  const accountKeys = await services.account.getKeys(issuerUuid);
  if ("keys" in accountKeys && accountKeys.keys.length > 0) return;

  const { jwk, pkcs8 } = await generateKey();
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

  const websiteExists = await prisma.websites.count({
    where: { accountId: issuerUuid },
  });
  if (websiteExists === 0) {
    const jwt = await services.publisher.registerWebsite(issuerUuid, pkcs8, {
      ...exampleWebsite,
      bodyFormat: exampleWebsite.bodyFormat as "html" | "text" | "visibleText",
      website: { ...exampleWebsite.website, type: "website" },
    });
    if (jwt instanceof Error) throw jwt;
    await services.publisher.issueDp(issuerUuid, jwt);
    console.log(`Document Profile: ${jwt}`);
  }
}

if (require.main === module) seed();
