import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWRImmutable from "swr/immutable";
import { useEvent } from "react-use";
import {
  RemoteKeys,
  ProfilesVerifier,
  expandProfileSet,
  expandProfilePairs,
} from "@originator-profile/verify";
import { NodeObject } from "jsonld";
import { Profile } from "@originator-profile/ui/src/types";
import { toProfile } from "@originator-profile/ui/src/utils";
import {
  fetchProfileSetMessageRequest,
  fetchProfileSetMessageResponse,
  fetchWebsiteProfilePairMessageResponse,
  PopupMessageRequest,
} from "../types/message";
import { routes } from "./routes";

const key = "profiles" as const;
const WebsiteProfilePairKey = "website-profile-pair" as const;

async function fetchVerifiedProfiles([, tabId]: [
  _: typeof key,
  tabId: number,
]): Promise<{
  advertisers: string[];
  publishers: string[];
  main: string[];
  profiles: Profile[];
  origin: string;
}> {
  const frames = (await chrome.webNavigation.getAllFrames({ tabId })) ?? [];
  const responses: Array<{ data: NodeObject; origin: string }> =
    await Promise.all(
      frames.map((frame) =>
        chrome.tabs
          .sendMessage<
            fetchProfileSetMessageRequest,
            fetchProfileSetMessageResponse
          >(
            tabId,
            {
              type: "fetch-profiles",
            },
            {
              frameId: frame.frameId,
            },
          )
          .then((response) => {
            const data = JSON.parse(response.data);
            if (!response.ok) throw data;
            return { data, origin: response.origin };
          }),
      ),
    ).catch((data) => {
      throw Object.assign(new Error(data.message), data);
    });
  const topLevelResponse =
    responses[frames.findIndex((frame) => frame.parentFrameId === -1)];

  const profileSet = await expandProfileSet(topLevelResponse?.data ?? []);
  const { ad } = await expandProfilePairs(responses.map(({ data }) => data));

  const registry = import.meta.env.PROFILE_ISSUER;
  const jwksEndpoint = new URL(
    import.meta.env.MODE === "development" && registry === "localhost"
      ? `http://localhost:8080/.well-known/jwks.json`
      : `https://${registry}/.well-known/jwks.json`,
  );
  const keys = RemoteKeys(jwksEndpoint);
  const origin = topLevelResponse?.origin ?? "";
  const verify = ProfilesVerifier(
    {
      profile: profileSet.profile,
      ad,
    },
    keys,
    registry,
    null,
    origin,
  );
  const verifyResult = await verify();

  return {
    advertisers: [
      ...new Set(...ad.map(({ op }) => op.sub), profileSet.advertisers),
    ],
    publishers: profileSet.publishers,
    main: profileSet.main,
    profiles: verifyResult.map(toProfile),
    origin,
  };
}

async function fetchVerifiedWebsiteProfilePair([, tabId]: [
  _: typeof WebsiteProfilePairKey,
  tabId: number,
]): Promise<{
  website: Profile[];
  origin: string;
}> {
  const { ok, data, origin }: fetchWebsiteProfilePairMessageResponse =
    await chrome.tabs.sendMessage(tabId, {
      type: "fetch-website-profile-pair",
    });
  if (!ok) {
    // 取得に失敗した場合にはエラーにしない（ website PP の設置は任意のため）
    return { website: [], origin };
  }
  const parsed = JSON.parse(data);
  const { website } = await expandProfilePairs([parsed]);

  const registry = import.meta.env.PROFILE_ISSUER;
  const jwksEndpoint = new URL(
    import.meta.env.MODE === "development" && registry === "localhost"
      ? `http://localhost:8080/.well-known/jwks.json`
      : `https://${registry}/.well-known/jwks.json`,
  );
  const keys = RemoteKeys(jwksEndpoint);

  const verifyResults =
    (website[0] &&
      (await ProfilesVerifier(
        {
          profile: [website[0].op.profile, website[0].dp.profile],
        },
        keys,
        registry,
        null,
        origin,
      )())) ??
    [];

  return {
    website: verifyResults.map(toProfile),
    origin,
  };
}

/**
 * Profile Set 取得 (要 Base コンポーネント)
 */
function useProfileSet() {
  const params = useParams<{ tabId: string }>();
  const tabId = Number(params.tabId);
  // TODO: 自動再検証する場合は取得エンドポイントが変わりうることをUIの振る舞いで考慮して
  const { data, error } = useSWRImmutable([key, tabId], fetchVerifiedProfiles);
  const { data: dataWebsite, error: errorWebsite } = useSWRImmutable(
    [WebsiteProfilePairKey, tabId],
    fetchVerifiedWebsiteProfilePair,
  );

  useEvent("unload", async function () {
    await chrome.tabs.sendMessage(tabId, { type: "close-window" });
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleMessageResponse = async (message: PopupMessageRequest) => {
      switch (message.type) {
        case "select-overlay-dp":
          navigate(
            [
              routes.base.build({ tabId: String(tabId) }),
              routes.publ.build(message.dp),
            ].join("/"),
          );
      }
    };
    chrome.runtime.onMessage.addListener(handleMessageResponse);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessageResponse);
    };
  }, [tabId, navigate]);

  return {
    ...dataWebsite,
    ...data,
    error:
      error ||
      errorWebsite ||
      (dataWebsite?.website.length === 0 && data?.profiles.length === 0
        ? new Error("プロファイルが見つかりませんでした")
        : null),
    tabId,
  };
}

export default useProfileSet;
