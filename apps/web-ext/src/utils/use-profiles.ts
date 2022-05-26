import browser from "webextension-polyfill";
import { createRemoteJWKSet, decodeJwt, jwtVerify } from "jose";
import { expand } from "jsonld";
import useSWR, { mutate } from "swr";
import { useAsync } from "react-use";
import { FetchProfilesMessageResponse } from "../types/message";
import { JwtProfilePayload, Profile } from "../types/profile";
import { toProfile } from "./profile";
import { isJwtOpPayload } from "./op";
import storage from "./storage";

const key = "profiles";

async function fetchProfiles(
  _: typeof key,
  targetOrigin?: string,
  profilesLink?: string
) {
  if (!targetOrigin) {
    throw new Error("プロファイルを取得するウェブページが特定できませんでした");
  }
  const context = "https://github.com/webdino/profile#";
  const profileEndpoint = new URL(
    profilesLink ?? `${targetOrigin}/.well-known/op-document`
  );
  const data = await fetch(profileEndpoint.href)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ステータスコード ${res.status}`);
      }
      return res.json();
    })
    .catch((e) => e);
  if (data instanceof Error) {
    throw {
      ...data,
      message: `プロファイルを取得できませんでした:\n${data.message}`,
    };
  }
  const [expanded] = await expand(data);
  if (!expanded) return { advertisers: [], mains: [], profiles: [] };
  const advertisers: string[] =
    // @ts-expect-error assert
    expanded[`${context}advertiser`]?.map(
      (advertiser: { "@value": string }) => advertiser["@value"]
    ) ?? [];
  const mains: string[] =
    // @ts-expect-error assert
    expanded[`${context}main`]?.map(
      (main: { "@value": string }) => main["@value"]
    ) ?? [];
  // @ts-expect-error assert
  const jwts: string[] = expanded[`${context}profile`].map(
    (profile: { "@value": string }) => profile["@value"]
  );
  const verifyResults = await Promise.all(
    jwts.map((jwt: string) => {
      const payload = decodeJwt(jwt) as JwtProfilePayload;
      const jwksEndpoint = new URL(
        `${
          isJwtOpPayload(payload) ? import.meta.env.PROFILE_ISSUER : payload.iss
        }/.well-known/jwks.json`
      );
      const jwks = createRemoteJWKSet(jwksEndpoint);
      return jwtVerify(jwt, jwks, { issuer: payload.iss })
        .then((dec) => dec.payload as JwtProfilePayload)
        .catch((e) => ({ payload, error: e }));
    })
  );
  return { advertisers, mains, profiles: verifyResults.map(toProfile) };
}

function useProfiles() {
  const message = useAsync(async () => {
    const tabId = storage.getItem("tabId");
    if (tabId === null) return null;
    const response: FetchProfilesMessageResponse =
      await browser.tabs.sendMessage(tabId, {
        type: "fetch-profiles",
      });
    return response;
  });
  const { data, error } = useSWR<{
    advertisers: string[];
    mains: string[];
    profiles: Profile[];
  }>(
    [key, message.value?.targetOrigin, message.value?.profilesLink],
    fetchProfiles
  );
  return {
    ...data,
    error: message.error || error,
    targetOrigin: message.value?.targetOrigin,
  };
}

export default useProfiles;

export function revalidateProfiles(targetOrigin?: string) {
  return mutate([key, targetOrigin]);
}
