import { Advertiser, BidResponse } from "./types";

/**
 * BidResponseにadvertiserが存在する場合はAdvertiserを返す
 * それ以外はnullを返す
 */
export function getAdvertiser(data: BidResponse): Advertiser | null {
  try {
    const ops = data?.bidresponse?.bid?.op ?? [];
    const advertiser = ops.find(
      (op: { type: string }) => op.type === "advertiser",
    );

    if (typeof advertiser?.id !== "string") {
      return null;
    }

    return advertiser;
  } catch {
    return null;
  }
}
