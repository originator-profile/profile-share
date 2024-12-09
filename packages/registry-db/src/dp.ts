import { fromUnixTime } from "date-fns";
import { JwtDpPayload } from "@originator-profile/model";
import { parseAccountId } from "@originator-profile/core";
import { getClient } from "./lib/prisma-client";

/** @deprecated */
export const DpRepository = () => ({
  /**
   * Signed Document Profile の登録 (ウェブページ)
   * @deprecated
   * @param decoded Signed Document Profile とデコード結果
   * @return Signed Document Profile
   */
  async create(decoded: {
    jwt: string;
    payload: JwtDpPayload;
  }): Promise<string> {
    const prisma = getClient();
    const issuedAt: Date = fromUnixTime(decoded.payload.iat);
    const expiredAt: Date = fromUnixTime(decoded.payload.exp);
    const accountId = parseAccountId(decoded.payload.iss);
    const websiteId = decoded.payload.sub;
    const jwt = decoded.jwt;

    await prisma.dps.create({
      data: {
        issuerId: accountId,
        jwt,
        issuedAt,
        expiredAt,
        websiteId,
      },
    });

    return jwt;
  },
});

/** @deprecated */
export type DpRepository = ReturnType<typeof DpRepository>;
