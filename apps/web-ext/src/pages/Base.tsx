import { useTitle, useMount } from "react-use";
import { Navigate } from "react-router-dom";
import { isDp } from "@originator-profile/core";
import { Dp, Profile } from "@originator-profile/ui/src/types";
import { sortDps, findProfileError } from "@originator-profile/ui/src/utils";
import { routes } from "../utils/routes";
import useProfileSet from "../utils/use-profile-set";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import Unsupported from "../components/Unsupported";
import Prohibition from "../components/Prohibition";

function Redirect({
  dp,
  tabId,
  profiles,
}: {
  dp: Dp;
  tabId: number;
  profiles: Profile[];
}) {
  useMount(() => {
    chrome.tabs.sendMessage(tabId, {
      type: "overlay-profiles",
      profiles,
      activeDp: dp,
    });
  });

  return (
    <Navigate
      to={[
        routes.base.build({ tabId: String(tabId) }),
        routes.publ.build(dp),
      ].join("/")}
    />
  );
}

function Base() {
  const { tabId, main = [], profiles, error, origin } = useProfileSet();

  useTitle(["コンテンツ情報", origin].filter(Boolean).join(" ― "));

  if (error) {
    return <Unsupported error={error} />;
  }
  if (!profiles) {
    return <Loading />;
  }

  const result = findProfileError(profiles);
  if (result?.code === "ERR_PROFILE_TOKEN_VERIFY_FAILED") {
    return <Prohibition />;
  }

  if (result) {
    return <Unsupported error={result} />;
  }
  const [dp] = sortDps(profiles.filter(isDp), main);
  if (!dp) {
    return <NotFound variant="dp" />;
  }

  return <Redirect dp={dp} tabId={tabId} profiles={profiles} />;
}

export default Base;
