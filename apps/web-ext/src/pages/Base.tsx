import { useTitle, useMount } from "react-use";
import { Navigate, useSearchParams } from "react-router-dom";
import { DocumentProfile, ProfileSet } from "@originator-profile/ui";
import { buildPublUrl } from "../utils/routes";
import useProfiles from "../utils/use-profiles";
import NotFound from "../components/NotFound";
import Unsupported from "../components/Unsupported";
import useVerifyFailureFeedback from "../utils/use-verify-failure-feedback";
import { _ } from "@originator-profile/ui/src/utils";

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
        timestamp: Date.now(),
        ...profiles.serialize(),
        activeDp: dp?.serialize(),
      });
    }
  });

  return <Navigate to={buildPublUrl(tabId, dp)} />;
}

function Base() {
  const [queryParams] = useSearchParams();
  const { tabId, profileSet, error, origin } = useProfiles();

  useTitle([_("Base_ContentsInformation"), origin].filter(Boolean).join(" ― "));

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
