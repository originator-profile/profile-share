import { useTitle } from "react-use";
import { Navigate } from "react-router-dom";
import { buildPublUrl } from "../utils/routes";
import { useSiteProfile } from "../components/siteProfile";
import { VerifiedSp } from "@originator-profile/verify";
import { _ } from "@originator-profile/ui/src/utils";
import Unsupported from "../components/Unsupported";
import NotFound from "../components/NotFound";
import useCredentials from "../components/credentials/use-credentials";

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

function Base() {
  const { tabId, siteProfile, error } = useSiteProfile();
  const { ops: _ops, cas: _cas } = useCredentials();

  useTitle([_("Base_ContentsInformation"), origin].filter(Boolean).join(" ― "));

  if (error) {
    return <Unsupported error={error} />;
  }

  if (!siteProfile) {
    return <NotFound variant="website" />;
  }

  return <Redirect tabId={tabId} />;
}

export default Base;
