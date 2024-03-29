import { Prisma } from "@prisma/client";
import { ContextDefinition, JsonLdDocument } from "jsonld";
import { fromUnixTime } from "date-fns";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";
import { JwtDpPayload } from "@originator-profile/model";
import {
  findFirstItemWithProof,
  parseAccountId,
} from "@originator-profile/core";
import { getClient } from "./lib/prisma-client";

export const AdRepository = () => ({
  /**
   * 広告の更新・作成
   * @param decoded Signed Document Profile とデコード結果 (広告)
   * @throws {BadRequestError} DpVisibleText, DpHtml, DpText いずれも見つからない
   * @returns SDP
   */
  async upsert(decoded: {
    jwt: string;
    payload: JwtDpPayload;
  }): Promise<string> {
    const prisma = getClient();
    const adId = decoded.payload.sub;
    const accountId = parseAccountId(decoded.payload.iss);
    const locator = findFirstItemWithProof(decoded.payload);
    if (!locator) {
      throw new BadRequestError(
        "Document Profile doesn't contain item with proof",
      );
    }

    const createInput = {
      id: adId,
      account: {
        connect: { id: accountId },
      },
      bodyFormat: {
        connect: { value: locator.type },
      },
      location: locator.location,
      proofJws: locator.proof.jws,
      allowedOrigins:
        decoded.payload["https://originator-profile.org/dp"].allowedOrigins,
    } as const satisfies Prisma.adsCreateInput;

    await prisma.ads.upsert({
      where: { id: adId, accountId },
      update: createInput,
      create: createInput,
    });

    const issuedAt: Date = fromUnixTime(decoded.payload.iat);
    const expiredAt: Date = fromUnixTime(decoded.payload.exp);
    const sdp = await prisma.dps.create({
      data: {
        adId,
        issuerId: accountId,
        jwt: decoded.jwt,
        issuedAt,
        expiredAt,
      },
    });

    return sdp.jwt;
  },

  /**
   * Ad Profile Pair の取得
   * @param id DP ID
   * @param contextDefinition https://www.w3.org/TR/json-ld11/#context-definitions
   * @throws {NotFoundError} Ad Profile Pair やその発行者が見つからない
   * @return Ad Profile Pair
   */
  async getProfilePair(
    id: string,
    contextDefinition:
      | ContextDefinition
      | string = "https://originator-profile.org/context.jsonld",
  ): Promise<JsonLdDocument> {
    const prisma = getClient();
    const data = await prisma.ads.findUnique({
      where: { id },
      include: {
        account: {
          include: {
            publications: {
              include: {
                op: true,
              },
              orderBy: {
                publishedAt: "desc",
              },
              take: 1,
            },
          },
        },
        dps: {
          orderBy: {
            issuedAt: "desc",
          },
          take: 1,
        },
      },
    });
    if (!data) throw new NotFoundError("Ad Profile Pair not found.");

    const issuer = await prisma.accounts.findUnique({
      where: { id: data.account.publications[0].op.certifierId },
    });
    if (!issuer) throw new NotFoundError("Issuer not found.");

    const profiles = {
      "@context": contextDefinition,
      ad: {
        op: {
          iss: issuer.domainName,
          sub: data.account.domainName,
          profile: data.account.publications[0].op.jwt,
        },
        dp: {
          sub: data.id,
          profile: data.dps[0].jwt,
        },
      },
    } satisfies JsonLdDocument;
    return profiles;
  },
});

export type AdRepository = ReturnType<typeof AdRepository>;
