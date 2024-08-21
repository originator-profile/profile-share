import { WebsiteMetadataFetchFailed, WebsiteMetadataInvalid } from "./errors";
import { FetchWebsiteMetadataResult } from "./types";

function getWebsiteMetadataUrl(origin: string) {
  return `${origin}/.well-known/was.json`;
}

/**
 * Website Metadata の取得
 * @param doc Document オブジェクト
 */
export async function fetchWebsiteMetadata(
  doc: Document,
): Promise<FetchWebsiteMetadataResult> {
  const websiteMetadataUrl = getWebsiteMetadataUrl(doc.location.origin);
  try {
    const response = await fetch(websiteMetadataUrl);
    if (response.ok) {
      const result = await response.json();
      return Array.isArray(result)
        ? new WebsiteMetadataInvalid(
            "website Metadata Must be a single Web Assertion Set",
            { payload: result },
          )
        : { ok: true, result };
    } else {
      return new WebsiteMetadataFetchFailed(
        `HTTP ステータスコード ${response.status}`,
        {},
      );
    }
  } catch (e) {
    if (e instanceof Error || e instanceof window.Error) {
      return new WebsiteMetadataFetchFailed(
        `Website Metadata を取得できませんでした:\n${e.message}`,
        { error: e },
      );
    } else {
      return new WebsiteMetadataFetchFailed("Unknown Error", { payload: e });
    }
  }
}
