import useSWRImmutable from "swr/immutable";
import { verifyBody, LocalKeys, extractBody } from "@webdino/profile-verify";
import { Jwks } from "@webdino/profile-model";
import { DpLocator } from "../types/profile";
import useElements from "../utils/use-elements";

const key = "verify-body" as const;

async function fetcher(
  _: typeof key,
  dpLocator: DpLocator,
  elements: NodeListOf<HTMLElement>,
  jwks?: Jwks
) {
  const body = extractBody(elements, dpLocator.type);
  return verifyBody(body, dpLocator.proof.jws, LocalKeys(jwks ?? { keys: [] }));
}

function useVerifyBody(dpLocator: DpLocator, jwks?: Jwks) {
  const { elements } = useElements(dpLocator.location);
  const { data: result, error } = useSWRImmutable<
    Awaited<ReturnType<typeof verifyBody>>
  >([key, dpLocator, elements, jwks], fetcher);
  return { result, error };
}

export default useVerifyBody;
