import { PrismaClient } from "@prisma/client";
import { fromUnixTime } from "date-fns";
import { BadRequestError } from "http-errors-enhanced";
import { JwtDpPayload } from "@originator-profile/model";
import { parseAccountId } from "@originator-profile/core";
import { getClient } from "./prisma-client";

export const DpRepository = () => ({
  /**
   * Signed Document Profile の登録
   * @param decoded Signed Document Profile とデコード結果
   * @return Signed Document Profile
   */
  async create(decoded: {
    jwt: string;
    payload: JwtDpPayload;
  }): Promise<string | Error> {
    const prisma = getClient();
    const issuedAt: Date = fromUnixTime(decoded.payload.iat);
    const expiredAt: Date = fromUnixTime(decoded.payload.exp);
    const accountId = parseAccountId(decoded.payload.iss);
    const websiteId = decoded.payload.sub;
    const jwt = decoded.jwt;
    const data = await prisma.dps
      .create({
        data: {
          issuerId: accountId,
          jwt,
          issuedAt,
          expiredAt,
          websiteId,
        },
      })
      .catch((e: Error) => e);
    if (!data) return new BadRequestError();
    if (data instanceof Error) return data;
    return jwt;
  },
});

export type DpRepository = ReturnType<typeof DpRepository>;
