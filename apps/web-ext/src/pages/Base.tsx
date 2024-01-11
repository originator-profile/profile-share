import { useTitle, useMount } from "react-use";
import { Navigate, useSearchParams } from "react-router-dom";
import { isDp } from "@originator-profile/core";
import { Dp, Profile } from "@originator-profile/ui/src/types";
import { sortDps } from "@originator-profile/ui/src/utils";
import { routes } from "../utils/routes";
import useProfileSet from "../utils/use-profile-set";
import NotFound from "../components/NotFound";
import Unsupported from "../components/Unsupported";
import useVerifyFailureFeedback from "../utils/use-verify-failure-feedback";

function Redirect({
  dp,
  tabId,
  profiles,
}: {
  dp?: Dp;
  tabId: number;
  profiles?: Profile[];
}) {
  useMount(() => {
    if (profiles) {
      chrome.tabs.sendMessage(tabId, {
        type: "overlay-profiles",
        profiles,
        activeDp: dp,
      });
    }
  });

  return (
    <Navigate
      to={[
        routes.base.build({ tabId: String(tabId) }),
        dp ? routes.publ.build(dp) : routes.site.build({}),
      ].join("/")}
    />
  );
}

function Base() {
  const [queryParams] = useSearchParams();
  const {
    tabId,
    main = [],
    profiles,
    website,
    error,
    origin,
  } = useProfileSet();

  useTitle(["コンテンツ情報", origin].filter(Boolean).join(" ― "));

  const element = useVerifyFailureFeedback({
    profiles: profiles,
    websiteProfiles: website,
    tabId,
    queryParams,
  });
  if (error) {
    return <Unsupported error={error} />;
  }
  if (element) {
    return element;
  }

  const [dp] = sortDps((profiles ?? []).filter(isDp), main);
  const [websiteDp] = sortDps((website ?? []).filter(isDp), []);
  if (!dp && !websiteDp) {
    return <NotFound variant="dp" />;
  }

  return <Redirect dp={dp} tabId={tabId} profiles={profiles} />;
}

export default Base;
