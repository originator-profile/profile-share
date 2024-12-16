import { useParams } from "react-router";
import useSWRImmutable from "swr/immutable";
import { SpVerifier, VerifiedSp } from "@originator-profile/verify";
import { siteProfileMessenger } from "./events";
import { getRegistryKeys } from "../../utils/get-registry-keys";

const key = "site-profile";

async function fetchVerifiedSiteProfile([, tabId]: [
  _: typeof key,
  tabId: number,
]): Promise<VerifiedSp> {
  const { ok, result } = await siteProfileMessenger.sendMessage(
    "fetchSiteProfile",
    null,
    tabId,
  );
  /* eslint-disable-next-line @typescript-eslint/only-throw-error */
  if (!ok) throw result;
  const registry = import.meta.env.PROFILE_ISSUER;
  const key = getRegistryKeys();
  const verifySp = SpVerifier(result, key, `dns:${registry}`);
  const verifiedSp = await verifySp();
  if (verifiedSp instanceof Error) {
    throw verifiedSp;
  }
  return verifiedSp;
}

/**
 * Site Profile 取得 (要 Base コンポーネント)
 */
export function useSiteProfile() {
  const params = useParams<{ tabId: string }>();
  const tabId = Number(params.tabId);
  const { data, error } = useSWRImmutable(
    [key, tabId],
    fetchVerifiedSiteProfile,
    {
      // NOTE: 404 だと再試行しつづけるのを抑制する目的
      shouldRetryOnError: false,
    },
  );
  return {
    siteProfile: data,
    error,
    tabId,
  };
}
