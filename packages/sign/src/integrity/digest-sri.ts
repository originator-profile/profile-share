import { createIntegrityMetadata, HashAlgorithm } from "websri";
import { DigestSriContent } from "./types";

/**
 * `digestSRI` の作成
 *
 * `content` にアクセスし `digestSRI` を計算します。
 * なお、`content` プロパティは削除されます。
 * `content` プロパティが存在しない場合、`id` にアクセスし `digestSRI` 計算します。
 * @see {@link https://www.w3.org/TR/SRI/#the-integrity-attribute}
 * @example
 * ```ts
 * const resource = {
 *   id: "<URL>",
 *   content: "<コンテンツ (URL)>", // 省略可能
 * };
 *
 * const { digestSRI } = await createDigestSri("sha256", resource);
 * console.log(digestSRI); // sha256-...
 * ```
 */
export async function createDigestSri(
  alg: HashAlgorithm,
  resource: {
    /** URL */
    id: string;
    /** コンテンツ (URL) */
    content?: string;
  },
  fetcher = fetch,
): Promise<DigestSriContent> {
  const res = await fetcher(resource.content ?? resource.id);
  const data = await res.arrayBuffer();
  const meta = await createIntegrityMetadata(alg, data);

  if (!meta.alg) return { id: resource.id };

  return {
    id: resource.id,
    digestSRI: meta.toString(),
  };
}
