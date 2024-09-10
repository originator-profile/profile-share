import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWRImmutable from "swr/immutable";
import { useEvent } from "react-use";
import {
  RemoteKeys,
  ProfilesVerifier,
  expandProfileSet,
  expandProfilePairs,
  LocalKeys,
  verifyBody,
  ProfileBodyExtractFailed,
} from "@originator-profile/verify";
import { NodeObject } from "jsonld";
import {
  DocumentProfile,
  ProfileSet,
  toProfilePayload,
  ProfileFactory,
  OriginatorProfile,
  Profile,
} from "@originator-profile/ui";
import {
  extractBodyRequest,
  extractBodyResponse,
  fetchProfileSetMessageRequest,
  fetchProfileSetMessageResponse,
  fetchWebsiteProfilePairMessageResponse,
  PopupMessageRequest,
} from "../types/message";
import { buildPublUrl } from "./routes";
import { DpLocator, isDp } from "@originator-profile/core";
import { Jwks } from "@originator-profile/model";
import { makeAdTree, updateAdIframe } from "../utils/ad-tree";
import { _ } from "@originator-profile/ui/src/utils";

const key = "profiles" as const;
const WebsiteProfilePairKey = "website-profile-pair" as const;
const bodiesKey = "bodies" as const;

async function fetchVerifiedProfiles([, tabId]: [
  _: typeof key,
  tabId: number,
]): Promise<ProfileSet> {
  const frames = (await chrome.webNavigation.getAllFrames({ tabId })) ?? [];
  const responses: Array<{
    data: NodeObject;
    origin: string;
    frameId: number;
    parentFrameId: number;
  }> = await Promise.all(
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
          return {
            data,
            origin: response.origin,
            frameId: frame.frameId,
            parentFrameId: frame.parentFrameId,
          };
        }),
    ),
  ).catch((data) => {
    throw Object.assign(new Error(data.message), data);
  });
  const topLevelFrameIndex = frames.findIndex(
    (frame) => frame.parentFrameId === -1,
  );
  const topLevelFrameId = frames[topLevelFrameIndex]?.frameId;
  const topLevelResponse = responses[topLevelFrameIndex];

  const profileSet = await expandProfileSet(topLevelResponse?.data ?? []);
  const ads = await Promise.all(
    responses.map(({ data, origin, frameId, parentFrameId }) =>
      expandProfilePairs(data).then(({ ad }) => ({
        ad,
        origin,
        frameId,
        parentFrameId,
      })),
    ),
  );
  const adTree = makeAdTree(ads);
  if (adTree) await updateAdIframe(tabId, adTree);

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
      ad: ads.flatMap(({ ad }) => ad),
    },
    keys,
    registry,
    null,
    origin,
  );
  const verifyResult = await verify();

  const advertiserOpIds = [
    ...new Set([
      ...profileSet.advertisers,
      ...ads.flatMap(({ ad }) => ad.map(({ op }) => op.sub)),
    ]),
  ];

  const frameInfoMap = new Map<
    string,
    { frameIds: number[]; origins: string[] }
  >();
  profileSet.profile.forEach((profile) => {
    frameInfoMap.set(profile, {
      frameIds: [topLevelFrameId ?? ProfileFactory.topLevelFrameIdDefaultValue],
      origins: [origin],
    });
  });
  ads.forEach(({ ad, origin, frameId }) => {
    ad.forEach(({ dp }) => {
      const frameInfo = frameInfoMap.get(dp.profile);
      if (frameInfo) {
        const { frameIds, origins } = frameInfo;
        frameInfoMap.set(dp.profile, {
          frameIds: [...frameIds, frameId],
          origins: [...origins, origin],
        });
      }
      frameInfoMap.set(dp.profile, { frameIds: [frameId], origins: [origin] });
    });
  });

  const profileFactory = new ProfileFactory(
    advertiserOpIds,
    profileSet.publishers,
    profileSet.main,
    topLevelFrameId,
  );

  const profiles = verifyResult.map((result) => {
    const profile = toProfilePayload(result);
    const jwt = result instanceof Error ? result.result.jwt : result.jwt;
    const info = frameInfoMap.get(jwt);
    return profileFactory.create(profile, info);
  });

  return new ProfileSet(profiles, origin);
}

async function extractBodiesOfDp(
  tabId: number,
  dp: DocumentProfile,
): Promise<(string | ProfileBodyExtractFailed)[]> {
  const dpLocator = dp.listLocatorItems()[0];
  const isAd = dp.isAp();
  const frameIds = dp.frameIds;
  if (!dpLocator || !frameIds) {
    return [];
  }
  const responses = await Promise.all(
    frameIds.map((frameId) => {
      return chrome.tabs
        .sendMessage<extractBodyRequest, extractBodyResponse>(
          tabId,
          {
            type: "extract-body",
            dpLocator: JSON.stringify(dpLocator),
            isAdvertisement: isAd,
          },
          {
            frameId,
          },
        )
        .then((response) => {
          const data = JSON.parse(response.data);
          if (!response.ok) {
            return Object.assign(
              new ProfileBodyExtractFailed(data.message),
              data,
            );
          }
          return data;
        });
    }),
  );
  return Array.from(new Set(responses));
}

async function verifyBodiesOfDp(
  dpLocator: DpLocator,
  bodies: string[],
  jwks: Jwks,
): Promise<Awaited<ReturnType<typeof verifyBody>>[]> {
  const verifyResults = await Promise.all(
    bodies.map((body) =>
      verifyBody(body, dpLocator.proof.jws, LocalKeys(jwks)),
    ),
  );
  return verifyResults;
}

async function fetchVerifiedBodies([, tabId, profileSet]: [
  _: typeof bodiesKey,
  tabId: number,
  profileSet: ProfileSet,
]): Promise<ProfileSet> {
  if (profileSet.hasError()) {
    return profileSet;
  }

  await Promise.all(
    profileSet.dps.map<Promise<DocumentProfile>>(async (dp) => {
      const dpLocator = dp.listLocatorItems()[0];

      if (!dpLocator) {
        dp.setBodyError("dpLocator not found in dp");
        return dp;
      }
      const jwks = profileSet.getOp(dp.issuer)?.getJwks() ?? null;

      const bodies = await extractBodiesOfDp(tabId, dp);
      const extractError = bodies.find(
        (result) => result instanceof ProfileBodyExtractFailed,
      );
      if (extractError && extractError instanceof ProfileBodyExtractFailed) {
        dp.setBodyError(extractError);
        return dp;
      }

      const verifyBodyResults = await verifyBodiesOfDp(
        dpLocator,
        bodies as string[],
        jwks ?? { keys: [] },
      );
      const verifyError = verifyBodyResults.find(
        (result) => result instanceof Error,
      );
      if (verifyError && verifyError instanceof Error) {
        dp.setBody(verifyError.result.body);
        dp.setBodyError(verifyError);
        return dp;
      }
      dp.setBody((bodies as string[])[0]);
      return dp;
    }),
  );

  return profileSet;
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
    website: verifyResults.map(toProfilePayload).map((profile) => {
      return isDp(profile)
        ? new DocumentProfile(profile)
        : new OriginatorProfile(profile);
    }),
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

  useEffect(() => {
    if (data && dataWebsite) {
      data.setWebsiteProfiles(dataWebsite.website);
    }
    if (data && errorWebsite) {
      data.setWebsiteProfiles([]);
    }
  }, [data, dataWebsite, errorWebsite]);

  const { data: profileSet, error: errorVerifiedBodies } = useSWRImmutable(
    data && dataWebsite ? [bodiesKey, tabId, data] : null,
    fetchVerifiedBodies,
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
            buildPublUrl(
              tabId,
              DocumentProfile.deserialize(
                message.dp.profile,
                message.dp.metadata,
              ),
            ),
          );
      }
    };
    chrome.runtime.onMessage.addListener(handleMessageResponse);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessageResponse);
    };
  }, [tabId, navigate]);

  return {
    origin: profileSet?.origin,
    profileSet: profileSet ?? ProfileSet.EMPTY_PROFILE_SET,
    error:
      error ||
      errorWebsite ||
      errorVerifiedBodies ||
      (data?.isEmpty() && dataWebsite?.website.length === 0
        ? new Error(_("Error_ProfileNotFound"))
        : null),
    tabId,
  };
}

export default useProfileSet;
