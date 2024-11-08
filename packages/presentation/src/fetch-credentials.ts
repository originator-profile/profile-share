import { ProfilesFetchFailed } from "./errors";

function getEndpoints(doc: Document, mediaType: string): string[] {
  const endpoints = [
    ...doc.querySelectorAll(`script[src][type="${mediaType}"]`),
  ].map((e) => new URL(e.getAttribute("src") ?? "", doc.location.href).href);

  return endpoints;
}

/**
 * 文書内の {mediaType} のデータの取得
 * @param doc Document オブジェクト
 * @param mediaType メディアタイプ
 */
function getEmbeddedCredentials(
  doc: Document = document,
  mediaType: string,
): unknown[] {
  const elements = [...doc.querySelectorAll(`script[type="${mediaType}"]`)];
  const credentialsArray = elements
    .map((elem) => {
      const text = elem.textContent;
      if (typeof text !== "string") {
        return undefined;
      }
      try {
        const json = JSON.parse(text);
        return json;
      } catch (e: unknown) {
        return undefined;
      }
    })
    .filter((e) => typeof e !== "undefined");

  return credentialsArray;
}

/**
 * {mediaType} のデータの取得
 * @param doc Document オブジェクト
 */
async function fetchCredentialSet(
  doc: Document,
  mediaType: string,
): Promise<unknown[] | ProfilesFetchFailed> {
  let profiles = getEmbeddedCredentials(doc, mediaType);
  try {
    const profileEndpoints = getEndpoints(doc, mediaType);

    const profileSetFromEndpoints = await Promise.all(
      profileEndpoints.map(async (endpoint) => {
        const res = await fetch(endpoint);

        if (!res.ok) {
          throw new ProfilesFetchFailed(`HTTP ステータスコード ${res.status}`);
        }

        return await res.json();
      }),
    );
    profiles = profiles.concat(profileSetFromEndpoints);
  } catch (e) {
    if (e instanceof Error || e instanceof window.Error) {
      return new ProfilesFetchFailed(
        `プロファイルを取得できませんでした:\n${e.message}`,
        {
          cause: e,
        },
      );
    } else {
      throw new Error("Unknown error", { cause: e });
    }
  }

  return profiles;
}

export const fetchContentAttestationSet = (doc: Document) =>
  fetchCredentialSet(doc, "application/cas+json");
export const fetchOriginatorProfileSet = (doc: Document) =>
  fetchCredentialSet(doc, "application/ops+json");

export const fetchCredentials = async (doc: Document) => {
  const [ops, cas] = await Promise.all([
    fetchOriginatorProfileSet(doc),
    fetchContentAttestationSet(doc),
  ]);
  if (cas instanceof Error || ops instanceof Error) {
    return ops instanceof Error ? ops : cas;
  }
  return [ops, cas];
};
