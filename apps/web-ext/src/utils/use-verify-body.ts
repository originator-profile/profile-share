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

async function fetcher([, dpLocator, jwks]: [
  _: typeof key,
  dpLocator: DpLocator,
  jwks?: Jwks
]) {
  const document = window.parent.document;
  const body = await extractBody(
    document.location.href,
    (location) => document.querySelectorAll<HTMLElement>(location),
    async (elements, type) => {
      const elArray = Array.from(elements);
      switch (type) {
        case "visibleText":
          return elArray.map((el) => el.innerText);
        case "text":
          return elArray.map((el) => el.textContent ?? "");
        case "html":
          return elArray.map((el) => el.outerHTML);
      }
    },
    dpLocator
  );
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
