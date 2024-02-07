import util from "node:util";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs/promises";
import { Services } from "@originator-profile/registry-service";
import exampleAccount from "./account.example.json";
import exampleWebsite from "./website.example.json";
import exampleCategories from "./category.example.json";
import { Dp, Jwk } from "@originator-profile/model";
import { addYears } from "date-fns/addYears";
import { isJwtDpPayload, parseAccountId } from "@originator-profile/core";
import { signBody, signDp } from "@originator-profile/sign";
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

  const example2 = {
    id: "41264c8a-4796-4206-a45c-7245f2315979",
    url: "http://localhost:8080/examples/many-dps.html",
    location: "#webpage-41264c8a-4796-4206-a45c-7245f2315979",
    bodyFormat: "visibleText",
    body: "署名対象のテキストです。",
    title: "DP 例ページ",
    image: "http://localhost:8080/credential-brand-safety-certified.png",
    description: "このページは開発時に DP を確認する際に使うことができます。",
    author: "山田太郎",
    editor: "山田花子",
    datePublished: "2023-12-20T19:14:00Z",
    dateModified: "2023-12-20T19:14:00Z",
  };
  const example3 = {
    id: "040a260d-b677-4f6f-9fb8-f1d4c990825c",
    url: "http://localhost:8080/examples/many-dps.html",
    location: "#webpage-040a260d-b677-4f6f-9fb8-f1d4c990825c",
    bodyFormat: "visibleText",
    body: "これはサブコンテンツです。",
    title: "サブコンテンツの例",
    author: "山田太郎",
    editor: "山田花子",
    datePublished: "2023-12-20T19:14:00Z",
    dateModified: "2023-12-20T19:14:00Z",
  };
  for (const { body, ...input } of [exampleWebsite, example2, example3]) {
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
    if (input.id === exampleWebsite.id) {
      // Profile Set Debugger の SDP
      console.log(`Document Profile: ${dpJwt}`);
    }
  }
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

    // サンプル Ad Profile Pair の登録 (packages/registry-ui/public/examples/ad.html で使用)
    const proofJws = await signBody("", privateKey);
    const dp = {
      type: "dp",
      issuer: exampleAccount.domainName,
      subject: "6a65e608-6b3e-4184-9fd2-0aafd1ddd38e",
      issuedAt: new Date().toISOString(),
      expiredAt: addYears(new Date(), 10).toISOString(),
      item: [
        {
          type: "advertisement",
          title: "Originator Profile",
          description:
            "Originator Profile 技術は、ウェブコンテンツの作成者や広告主などの情報を検証可能な形で付与することで、第三者認証済みの良質な記事やメディアを容易に見分けられるようにする技術です。",
          image: "https://op-logos.demosites.pages.dev/placeholder-120x80.png",
        },
        {
          type: "visibleText",
          location: "#ad-6a65e608-6b3e-4184-9fd2-0aafd1ddd38e",
          proof: { jws: proofJws },
        },
      ],
      allowedOrigins: [new URL(appUrl).origin],
    } satisfies Dp;
    const sdp = await signDp(dp, privateKey);
    const decoded = services.validator.decodeToken(sdp);
    if (decoded instanceof Error || !isJwtDpPayload(decoded.payload)) {
      throw decoded;
    }
    await services.adRepository.upsert({
      jwt: decoded.jwt,
      payload: decoded.payload,
    });
  }
}

if (require.main === module) seed();
