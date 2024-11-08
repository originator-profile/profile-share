import {
  expandProfilePairs,
  expandProfileSet,
} from "@originator-profile/verify";

/** Profile Pair あるいは Profile Set の展開 */
export async function expand(
  source: unknown,
): Promise<ReturnType<typeof expandProfileSet> | Error> {
  if (typeof source !== "object" || source === null)
    return new Error("Source is not Profile Set");
  const pp = await expandProfilePairs(source).catch((e) => e);
  const isAdPp = pp.ad?.length > 0;
  const isSitePp = pp.website?.length > 0;
  return expandProfileSet(
    isAdPp
      ? {
          ...source,
          profile: [pp.ad[0].op.profile, pp.ad[0].dp.profile],
        }
      : isSitePp
        ? {
            ...source,
            profile: [pp.website[0].op.profile, pp.website[0].dp.profile],
          }
        : source,
  ).catch((e) => e);
}
