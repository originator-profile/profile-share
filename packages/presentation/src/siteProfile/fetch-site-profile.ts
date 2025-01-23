import { SiteProfileFetchFailed, SiteProfileFetchInvalid } from "./errors";
import { FetchSiteProfileResult } from "./types";

function getSiteProfileUrl(origin: string) {
  return `${origin}/.well-known/sp.json`;
}

/**
 * Site Profile の取得
 * @param doc Document オブジェクト
 */
export async function fetchSiteProfile(
  doc: Document,
): Promise<FetchSiteProfileResult> {
  const siteProfileUrl = getSiteProfileUrl(doc.location.origin);
  try {
    const response = await fetch(siteProfileUrl);
    if (response.ok) {
      const result = await response.json();
      return Array.isArray(result)
        ? new SiteProfileFetchInvalid(
            "Site Profile Must be a single Site Profile",
            {
              payload: result,
            },
          )
        : { ok: true, result, origin: doc.location.origin };
    } else {
      return new SiteProfileFetchFailed("Site Profile fetch failed", {
        error: new Error(`HTTP status code ${response.status}`),
      });
    }
  } catch (e) {
    if (e instanceof Error || e instanceof window.Error) {
      return new SiteProfileFetchFailed(
        `Site Profile fetch failed:\n${e.message}`,
        { error: e },
      );
    } else {
      return new SiteProfileFetchFailed("Unknown Error", { payload: e });
    }
  }
}
