import { ProfilesFetchFailed } from "./errors";

function getSiteProfileUrl(origin: string) {
  return `${origin}/.well-known/sp.json`;
}

/**
 * TODO: fetchCredentials と共通化できないか
 * Site Profile の取得
 * @param doc Document オブジェクト
 */
export async function fetchSiteProfile(
  doc: Document,
): Promise<object | ProfilesFetchFailed> {
  const url = getSiteProfileUrl(doc.location.origin);
  try {
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      return json;
    } else {
      return new ProfilesFetchFailed(
        `HTTP ステータスコード ${response.status}`,
      );
    }
  } catch (e) {
    if (e instanceof Error || e instanceof window.Error) {
      return new ProfilesFetchFailed(
        `Site Profile を取得できませんでした:\n${e.message}`,
        {
          cause: e,
        },
      );
    } else {
      throw new Error("Unknown error", { cause: e });
    }
  }
}
