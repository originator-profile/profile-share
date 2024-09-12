import { useTitle, useMount } from "react-use";
import { Navigate, useSearchParams } from "react-router-dom";
import { DocumentProfile, ProfileSet } from "@originator-profile/ui";
import { buildPublUrl } from "../utils/routes";
import useProfileSet from "../utils/use-profile-set";
import NotFound from "../components/NotFound";
import Unsupported from "../components/Unsupported";
import useVerifyFailureFeedback from "../utils/use-verify-failure-feedback";

function Redirect({
  dp,
  tabId,
  profiles,
}: {
  dp?: DocumentProfile;
  tabId: number;
  profiles?: ProfileSet;
}) {
  useMount(() => {
    if (profiles) {
      chrome.tabs.sendMessage(tabId, {
        type: "overlay-profiles",
        ...profiles.serialize(),
        activeDp: dp?.serialize(),
      });
    }
  });

  return <Navigate to={buildPublUrl(tabId, dp)} />;
}

function Base() {
  const [queryParams] = useSearchParams();
  const { tabId, profileSet, error, origin } = useProfileSet();

  useTitle(["コンテンツ情報", origin].filter(Boolean).join(" ― "));

  const element = useVerifyFailureFeedback({
    profiles: profileSet,
    tabId,
    queryParams,
  });
  if (error) {
    return <Unsupported error={error} />;
  }
  if (element) {
    return element;
  }

  const dp = profileSet?.dps[0];
  if (profileSet.isEmpty()) {
    return <NotFound variant="dp" />;
  }

  return <Redirect dp={dp} tabId={tabId} profiles={profileSet} />;
}

export default Base;
