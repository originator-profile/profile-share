import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWRImmutable from "swr/immutable";
import { useEvent } from "react-use";
import {
  RemoteKeys,
  ProfilesVerifier,
  expandProfileSet,
} from "@originator-profile/verify";
import { Profile } from "@originator-profile/ui/src/types";
import { toProfile } from "@originator-profile/ui/src/utils";
import {
  fetchProfileSetMessageResponse,
  PopupMessageRequest,
} from "../types/message";
import { routes } from "./routes";

const key = "profiles" as const;

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
  const { ok, data, origin }: fetchProfileSetMessageResponse =
    await chrome.tabs.sendMessage(tabId, {
      type: "fetch-profiles",
    });
  const parsed = JSON.parse(data);
  if (!ok) throw Object.assign(new Error(parsed.message), parsed);
  const { advertisers, publishers, main, profile } =
    await expandProfileSet(parsed);
  const registry = import.meta.env.PROFILE_ISSUER;
  const jwksEndpoint = new URL(
    import.meta.env.MODE === "development" && registry === "localhost"
      ? `http://localhost:8080/.well-known/jwks.json`
      : `https://${registry}/.well-known/jwks.json`,
  );
  const keys = RemoteKeys(jwksEndpoint);
  const verify = ProfilesVerifier({ profile }, keys, registry, null, origin);
  const verifyResults = await verify();
  return {
    advertisers,
    publishers,
    main,
    profiles: verifyResults.map(toProfile),
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
    ...data,
    error,
    tabId,
  };
}

export default useProfileSet;
