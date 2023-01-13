import { useTitle, useMount } from "react-use";
import { Navigate } from "react-router-dom";
import { isDp } from "@webdino/profile-core";
import { Dp, Profile } from "../types/profile";
import { sortDps } from "../utils/profile";
import { routes } from "../utils/routes";
import useProfiles from "../utils/use-profiles";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import { ProfilesFetchFailed } from "@webdino/profile-verify";
import Unsupported from "../components/Unsupported";

function Dp({
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
  const { tabId, main = [], profiles, error, profileEndpoint } = useProfiles();

  useTitle(
    ["コンテンツ情報", profileEndpoint?.origin].filter(Boolean).join(" ― ")
  );

  if (error instanceof ProfilesFetchFailed) {
    return <Unsupported />;
  }
  if (error) {
    return (
      <ErrorPlaceholder>
        <p className="whitespace-pre-wrap">{error.message}</p>
      </ErrorPlaceholder>
    );
  }
  if (!profiles) {
    return (
      <LoadingPlaceholder>
        <p>
          {profileEndpoint && `${profileEndpoint.origin} の`}
          プロファイルを取得検証しています...
        </p>
      </LoadingPlaceholder>
    );
  }
  const [dp] = sortDps(profiles.filter(isDp), main);
  if (!dp) {
    return (
      <ErrorPlaceholder>
        <p>プロファイルが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  return <Dp dp={dp} tabId={tabId} profiles={profiles} />;
}

export default Base;
