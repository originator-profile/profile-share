import util from "node:util";
import { Prisma, PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import {
  generateKeyPair,
  exportJWK,
  exportSPKI,
  exportPKCS8,
  SignJWT,
} from "jose";
import { addYears, getUnixTime } from "date-fns";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import Jwk from "@webdino/profile-model/src/jwk";
import Op from "@webdino/profile-model/src/op";

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

  await waitForDb(prisma);

  const issuerExists = await prisma.accounts.findUnique({
    where: { id: issuerUuid },
  });
  let issuer = issuerExists;
  if (!issuerExists) {
    issuer = await prisma.accounts.create({
      data: {
        id: issuerUuid,
        url: "http://localhost:8080",
        roleValue: "certifier",
        name: "WebDINO Japan OPR",
        description: "Profile Registry (Demo)",
        email: "example@webdino.org",
        phoneNumber: "0123456789",
        postalCode: "123-4567",
        addressCountry: "JP",
        addressRegion: "東京都",
        addressLocality: "中央区",
        addressStreet: "日本橋富沢町 10-13 WORK EDITION NIHONBASHI 3F",
      },
    });
  }

  const keysExists = await prisma.keys.count({
    where: { accountId: issuerUuid },
  });
  if (keysExists === 0) {
    const { publicKey, privateKey } = await generateKeyPair("ES256");
    const [publicJwk, spki, pkcs8] = await Promise.all([
      exportJWK(publicKey),
      exportSPKI(publicKey),
      exportPKCS8(privateKey),
    ]);
    const issuedAt = new Date();
    const expiredAt = addYears(new Date(), 10);
    const op: Op = {
      issuedAt: issuedAt.toISOString(),
      expiredAt: expiredAt.toISOString(),
      issuer: "http://localhost:8080",
      subject: "http://localhost:8080",
      item: [
        {
          type: "certifier",
          ...issuer,
        },
        {
          type: "credential",
        },
        {
          type: "holder",
          ...issuer,
        },
      ],
      jwks: { keys: [publicJwk as Jwk] },
    };
    const ajv = new Ajv({ removeAdditional: true });
    addFormats(ajv);
    ajv.compile(Op)(op);
    const jwt = await new SignJWT({
      "https://opr.webdino.org/jwt/claims/op": {
        item: op.item,
        jwks: op.jwks,
      },
    })
      .setProtectedHeader({ alg: "ES256" })
      .setIssuer(op.issuer)
      .setSubject(op.subject)
      .setIssuedAt(getUnixTime(issuedAt))
      .setExpirationTime(getUnixTime(expiredAt))
      .sign(privateKey);
    await prisma.keys.create({
      data: {
        accountId: issuerUuid,
        jwk: publicJwk as Prisma.InputJsonValue,
      },
    });
    await prisma.ops.create({
      data: {
        certifierId: issuerUuid,
        issuedAt,
        expiredAt,
        jwt,
        publication: {
          create: { accountId: issuerUuid },
        },
      },
    });
    console.log(`Profile:
${jwt}

${spki}
${pkcs8}`);
  }
}

if (require.main === module) seed();
