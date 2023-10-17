import useSWRImmutable from "swr/immutable";
import {
  verifyBody,
  LocalKeys,
  extractBody,
  ProfileBodyExtractFailed,
} from "@originator-profile/verify";
import { Jwks } from "@originator-profile/model";
import { DpLocator } from "../types/dp-locator";

const key = "verify-body" as const;

async function fetcher([, dpLocator, jwks]: [
  _: typeof key,
  dpLocator: DpLocator,
  jwks?: Jwks,
]) {
  const document = window.parent.document;
  const body = await extractBody(
    document.location.href,
    async (location) =>
      Array.from(document.querySelectorAll<HTMLElement>(location)),
    dpLocator,
  );
  if (body instanceof ProfileBodyExtractFailed) return body;
  return verifyBody(body, dpLocator.proof.jws, LocalKeys(jwks ?? { keys: [] }));
}

function useVerifyBody(dpLocator: DpLocator, jwks?: Jwks) {
  const { data: result, error } = useSWRImmutable<
    Awaited<ReturnType<typeof verifyBody>> | ProfileBodyExtractFailed
  >([key, dpLocator, jwks], fetcher);
  return { result, error };
}

export default useVerifyBody;
