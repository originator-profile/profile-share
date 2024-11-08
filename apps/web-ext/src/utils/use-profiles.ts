import { DpLocator, isDp } from "@originator-profile/core";
import { RemoteKeys, LocalKeys } from "@originator-profile/cryptography";
import { Jwks } from "@originator-profile/model";
import {
  DocumentProfile,
  OriginatorProfile,
  Profile,
  ProfileFactory,
  ProfileSet,
  toProfilePayload,
} from "@originator-profile/ui";
import {
  expandProfilePairs,
  expandProfileSet,
  ProfileBodyExtractFailed,
  ProfilePair,
  ProfilesVerifier,
  verifyBody,
} from "@originator-profile/verify";
import { NodeObject } from "jsonld";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEvent } from "react-use";
import useSWRImmutable from "swr/immutable";
import {
  extractBodyRequest,
  extractBodyResponse,
  fetchProfileSetMessageRequest,
  fetchProfileSetMessageResponse,
  fetchWebsiteProfilePairMessageResponse,
  PopupMessageRequest,
} from "../types/message";
import { makeAdTree, updateAdIframe } from "../utils/ad-tree";
import { buildPublUrl } from "./routes";

const PROFILES_KEY = "profiles" as const;
const WEBSITE_PROFILE_KEY = "website-profile-pair" as const;
const VERIFIED_BODIES_KEY = "bodies" as const;
const REGISTRY = import.meta.env.PROFILE_ISSUER;

type FetchProfilesResult = {
  data: NodeObject[];
  origin: string;
  frameId: number;
  parentFrameId: number;
};

/**
 * OP レジストリの JWKS を取得する
 * @returns レジストリの JWKS
 */
function getRegistryKeys() {
  const jwksEndpoint = new URL(
    import.meta.env.MODE === "development" && REGISTRY === "localhost"
      ? `http://localhost:8080/.well-known/jwks.json`
      : `https://${REGISTRY}/.well-known/jwks.json`,
  );

  return RemoteKeys(jwksEndpoint);
}

/**
 * タブ内の各フレームでプロファイルを取得する。
 * @param frames フレームのリスト
 * @param tabId タブID
 * @returns 結果の配列
 */
async function fetchProfiles(
  frames: chrome.webNavigation.GetAllFrameResultDetails[],
  tabId: number,
) {
  const results: PromiseSettledResult<FetchProfilesResult>[] =
    await Promise.allSettled(
      frames.map((frame) =>
        chrome.tabs
          .sendMessage<
            fetchProfileSetMessageRequest,
            fetchProfileSetMessageResponse
          >(
            tabId,
            {
              type: "fetch-profiles",
              timestamp: Date.now(),
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
    );

  const errors = results.filter(
    (r): r is PromiseRejectedResult => r.status === "rejected",
  );
  errors.forEach(({ reason }) => {
    console.error(reason);
  });

  const responses = results
    .filter(
      (r): r is PromiseFulfilledResult<FetchProfilesResult> =>
        r.status === "fulfilled",
    )
    .map(({ value }) => value);

  if (responses.length === 0) {
    const error = errors[0]?.reason;
    throw Object.assign(new Error(error.message), error);
  }
  return responses;
}

/**
 * プロファイルとフレームのマッピングを返す
 * @param profileSet プロファイルセット
 * @param topLevelFrameId トップレベルのフレームID
 * @param origin オリジン
 * @param ads 広告プロファイルペアのリスト
 * @returns プロファイルとフレームのマッピング
 */
function mapProfileToFrame(
  profileSet: {
    advertisers: string[];
    publishers: string[];
    main: string[];
    profile: string[];
  },
  topLevelFrameId: number | undefined,
  origin: string,
  ads: {
    ad: ProfilePair[];
    origin: string;
    frameId: number;
    parentFrameId: number;
  }[],
) {
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
  return frameInfoMap;
}

async function fetchVerifiedProfiles([, tabId]: [
  _: typeof PROFILES_KEY,
  tabId: number,
]): Promise<ProfileSet> {
  const frames = (await chrome.webNavigation.getAllFrames({ tabId })) ?? [];
  const responses = await fetchProfiles(frames, tabId);

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

  const origin = topLevelResponse?.origin ?? "";
  const verify = ProfilesVerifier(
    {
      profile: profileSet.profile,
      ad: ads.flatMap(({ ad }) => ad),
    },
    getRegistryKeys(),
    REGISTRY,
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

  const frameInfoMap = mapProfileToFrame(
    profileSet,
    topLevelFrameId,
    origin,
    ads,
  );

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
            timestamp: Date.now(),
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
  _: typeof VERIFIED_BODIES_KEY,
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
  _: typeof WEBSITE_PROFILE_KEY,
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

  const verifyResults =
    (website[0] &&
      (await ProfilesVerifier(
        {
          profile: [website[0].op.profile, website[0].dp.profile],
        },
        getRegistryKeys(),
        REGISTRY,
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
 * select-overlay-dp メッセージのイベントハンドラを登録する
 * @param tabId タブ ID
 */
function useSelectDp(tabId: number) {
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
}

/**
 * Profiles 取得 (要 Base コンポーネント)
 * @deprecated
 */
function useProfiles() {
  const params = useParams<{ tabId: string }>();
  const tabId = Number(params.tabId);
  // TODO: 自動再検証する場合は取得エンドポイントが変わりうることをUIの振る舞いで考慮して
  const { data, error } = useSWRImmutable(
    [PROFILES_KEY, tabId],
    fetchVerifiedProfiles,
  );
  const { data: dataWebsite, error: errorWebsite } = useSWRImmutable(
    [WEBSITE_PROFILE_KEY, tabId],
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
    data && dataWebsite ? [VERIFIED_BODIES_KEY, tabId, data] : null,
    fetchVerifiedBodies,
  );

  useEvent("unload", async function () {
    await chrome.tabs.sendMessage(tabId, { type: "close-window" });
  });

  useSelectDp(tabId);

  return {
    origin: profileSet?.origin,
    profileSet: profileSet ?? ProfileSet.EMPTY_PROFILE_SET,
    error: error || errorWebsite || errorVerifiedBodies,
    tabId,
  };
}

export default useProfiles;
