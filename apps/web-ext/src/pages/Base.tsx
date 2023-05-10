import { useTitle, useMount } from "react-use";
import { Navigate } from "react-router-dom";
import { isDp } from "@webdino/profile-core";
import { Dp, Profile } from "@webdino/profile-ui/src/types";
import {
  sortDps,
  findProfileGenericError,
} from "@webdino/profile-ui/src/utils";
import { routes } from "../utils/routes";
import useProfiles from "../utils/use-profiles";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import Unsupported from "../components/Unsupported";

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
  const { tabId, main = [], profiles, error, origin } = useProfiles();

  useTitle(["コンテンツ情報", origin].filter(Boolean).join(" ― "));

  if (error) {
    return <Unsupported error={error} />;
  }
  if (!profiles) {
    return <Loading />;
  }
  const result = findProfileGenericError(profiles);
  // TODO: 禁止のケースの見た目を実装して
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
