import { useParams } from "react-router-dom";
import useSWRImmutable from "swr/immutable";
import {
  OriginatorProfileDecoder,
  OriginatorProfileVerifier,
  JwtVcIssuerKeys,
  decodeSdJwt,
} from "@originator-profile/verify";
import { websiteMetadataMessenger } from "./events";
import { VerifiedWebsiteMetadata } from "./types";

const key = "website-metadata" as const;

async function fetchVerifiedWebsiteMetadata([, tabId]: [
  _: typeof key,
  tabId: number,
]): Promise<VerifiedWebsiteMetadata> {
  const { ok, result } = await websiteMetadataMessenger.sendMessage(
    "fetchWebsiteMetadata",
    null,
    tabId,
  );
  if (!ok) throw result;
  const jwksEndpoint = new URL(
    "/.well-known/jwt-vc-issuer",
    import.meta.env.PROFILE_REGISTRY_URL,
  );
  const keys = JwtVcIssuerKeys(jwksEndpoint);
  const decoder = OriginatorProfileDecoder(null);
  const verifier = OriginatorProfileVerifier(
    keys,
    import.meta.env.PROFILE_REGISTRY_URL,
    decoder,
  );
  const originator = await verifier(result.originator);
  if (originator instanceof Error) throw originator;
  // TODO: Certificate を検証して
  const certificates = result.certificates.map((certificate) => {
    try {
      return decodeSdJwt(certificate);
    } catch (e) {
      return e;
    }
  });
  // TODO: WebsiteMetadata を検証して
  const assertions = result.assertions.map((assertion) => {
    try {
      return decodeSdJwt(assertion);
    } catch (e) {
      return e;
    }
  });
  return { originator: originator.payload, certificates, assertions };
}

/**
 * Website Metadata 取得 (要 Base コンポーネント)
 */
export function useWebsiteMetadata() {
  const params = useParams<{ tabId: string }>();
  const tabId = Number(params.tabId);
  return useSWRImmutable([key, tabId], fetchVerifiedWebsiteMetadata, {
    // NOTE: 404 だと再試行しつづけるのを抑制する目的
    shouldRetryOnError: false,
  });
}
