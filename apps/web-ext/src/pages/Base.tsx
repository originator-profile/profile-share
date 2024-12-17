import { useTitle } from "react-use";
import { Navigate } from "react-router";
import { buildPublUrl } from "../utils/routes";
import { useSiteProfile } from "../components/siteProfile";
import {
  SiteProfileFetchFailed,
  SiteProfileFetchInvalid,
  VerifiedOps,
  VerifiedSp,
} from "@originator-profile/verify";
import { _ } from "@originator-profile/ui/src/utils";
import Unsupported from "../components/Unsupported";
import NotFound from "../components/NotFound";
import { useCredentials, VerifiedCas } from "../components/credentials";
import Loading from "../components/Loading";

function Redirect({ tabId }: { tabId: number; siteProfile?: VerifiedSp }) {
  /* TODO: cas を送る */
  /*
  useMount(() => {
    if (profiles) {
      chrome.tabs.sendMessage(tabId, {
        type: "overlay-profiles",
        timestamp: Date.now(),
        ...profiles.serialize(),
        activeDp: dp?.serialize(),
      });
    }
  });
  */

  return <Navigate to={buildPublUrl(tabId, undefined)} />;
}

function isLoading({
  siteProfile,
  sp_error,
  ops,
  cas,
  credentials_error,
}: {
  siteProfile?: VerifiedSp;
  sp_error?: Error;
  ops?: VerifiedOps;
  cas?: VerifiedCas;
  credentials_error?: Error;
}) {
  /* TODO: #1678 CAS未取得時/未エラー時を正しく判断 */
  return (!siteProfile && !sp_error) || (!ops && !cas && !credentials_error);
}

function Base() {
  const { tabId, siteProfile, error: sp_error } = useSiteProfile();
  const { ops, cas, error: credentials_error } = useCredentials();
  useTitle([_("Base_ContentsInformation"), origin].filter(Boolean).join(" ― "));

  if (isLoading({ siteProfile, sp_error, ops, cas, credentials_error })) {
    return <Loading />;
  }
  /* instanceof Error|SiteProfileFetchFailed|SiteProfileFetchInvalid では判定できない */
  /* TODO: #1678 SiteProfile/CASの両方が取得できていない場合に NotFound, 検証エラーとは異なることに注意 */
  if (
    sp_error &&
    "code" in sp_error &&
    (sp_error.code === SiteProfileFetchFailed.code ||
      sp_error.code === SiteProfileFetchInvalid.code)
  ) {
    return <NotFound variant="websiteAndCas" errors={[sp_error]} />;
  }

  if (sp_error) {
    return <Unsupported error={sp_error} />;
  }
  if (credentials_error) {
    return <Unsupported error={credentials_error} />;
  }

  return <Redirect tabId={tabId} />;
}

export default Base;
