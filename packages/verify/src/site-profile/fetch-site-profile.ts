import {
  SiteProfileFetchFailed,
  SiteProfileFetchInvalid,
} from "./fetch-errors";
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
        : { ok: true, result };
    } else {
      return new SiteProfileFetchFailed(
        `HTTP ステータスコード ${response.status}`,
        {},
      );
    }
  } catch (e) {
    if (e instanceof Error || e instanceof window.Error) {
      return new SiteProfileFetchFailed(
        `Site Profile を取得できませんでした:\n${e.message}`,
        { error: e },
      );
    } else {
      return new SiteProfileFetchFailed("Unknown Error", { payload: e });
    }
  }
}
