import { useParams } from "react-router-dom";
import useSWRImmutable from "swr/immutable";
import {
  CoreProfile,
  WebMediaProfile,
  WebsiteProfile,
} from "@originator-profile/model";
import {
  JwtVcVerifier,
  VcDecoder,
  VcValidator,
} from "@originator-profile/jwt-securing-mechanism";
import { JwtVcIssuerKeys } from "@originator-profile/verify";
import { siteProfileMessenger } from "./events";
import { VerifiedSiteProfile } from "./types";

const key = "site-profile" as const;

async function fetchVerifiedSiteProfile([, tabId]: [
  _: typeof key,
  tabId: number,
]): Promise<VerifiedSiteProfile> {
  const { ok, result } = await siteProfileMessenger.sendMessage(
    "fetchSiteProfile",
    null,
    tabId,
  );
  if (!ok) throw result;
  const registry = import.meta.env.PROFILE_ISSUER;
  const jwksEndpoint = new URL(
    import.meta.env.MODE === "development" && registry === "localhost"
      ? `http://localhost:8080/.well-known/jwt-vc-issuer`
      : `https://${registry}/.well-known/jwt-vc-issuer`,
  );
  const keys = JwtVcIssuerKeys(jwksEndpoint);
  const cpDecoder = VcDecoder(VcValidator(CoreProfile));
  const cpVerifier = JwtVcVerifier(keys, `dns:${registry}`, cpDecoder);
  const wmpDecoder = VcDecoder(VcValidator(WebMediaProfile));
  const wmpVerifier = JwtVcVerifier(keys, `dns:${registry}`, wmpDecoder);
  const wspDecoder = VcDecoder(VcValidator(WebsiteProfile));

  const originators = await Promise.all(
    result.originators.map(async (originator) => {
      const cpVerified = await cpVerifier(originator.core);
      if (cpVerified instanceof Error) throw cpVerified;
      const cp = cpVerified.payload as CoreProfile;
      /* TODO: VC もデコード/検証する */
      const wmpVerified =
        originator.media && (await wmpVerifier(originator.media));
      if (wmpVerified instanceof Error) throw wmpVerified;
      const wmp = wmpVerified
        ? (wmpVerified.payload as WebMediaProfile)
        : undefined;
      if (wmp && wmp.credentialSubject.id !== cp.credentialSubject.id) {
        throw new Error("CoreProfile と WebMediaProfile の対象が異なります");
      }
      return {
        core: cp,
        annotations: [],
        ...(wmp !== undefined && { media: wmp }),
      };
    }),
  );
  /* TODO: WebsiteProfile を検証する */
  const credential = wspDecoder(result.credential) as WebsiteProfile;
  return { originators, credential };
}

/**
 * Website Metadata 取得 (要 Base コンポーネント)
 */
export function useSiteProfile() {
  const params = useParams<{ tabId: string }>();
  const tabId = Number(params.tabId);
  return useSWRImmutable([key, tabId], fetchVerifiedSiteProfile, {
    // NOTE: 404 だと再試行しつづけるのを抑制する目的
    shouldRetryOnError: false,
  });
}
