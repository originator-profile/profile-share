import useSWRImmutable from "swr/immutable";
import {
  verifyBody,
  LocalKeys,
  extractBody,
  ProfileBodyExtractFailed,
} from "@webdino/profile-verify";
import { Jwks } from "@webdino/profile-model";
import { DpLocator } from "../types/profile";

const key = "verify-body" as const;

async function fetcher(_: typeof key, dpLocator: DpLocator, jwks?: Jwks) {
  const body = extractBody(window.parent.document, dpLocator);
  if (body instanceof Error) return body;
  return verifyBody(body, dpLocator.proof.jws, LocalKeys(jwks ?? { keys: [] }));
}

function useVerifyBody(dpLocator: DpLocator, jwks?: Jwks) {
  const { data: result, error } = useSWRImmutable<
    Awaited<ReturnType<typeof verifyBody>> | ProfileBodyExtractFailed
  >([key, dpLocator, jwks], fetcher);
  return { result, error };
}

export default useVerifyBody;
