import { createIntegrityMetadata, HashAlgorithm } from "websri";
import { DigestSriContent } from "./types";

/**
 * `digestSRI` の作成
 * @see {@link https://www.w3.org/TR/SRI/#the-integrity-attribute}
 * @example
 * ```ts
 * const resource = {
 *   id: "<URL>",
 * };
 *
 * const { digestSRI } = await createDigestSri("sha256", resource);
 * console.log(digestSRI); // sha256-...
 * ```
 */
export async function createDigestSri(
  alg: HashAlgorithm,
  resource: { id: string },
  fetcher = fetch,
): Promise<DigestSriContent> {
  const res = await fetcher(resource.id);
  const data = await res.arrayBuffer();
  const meta = await createIntegrityMetadata(alg, data);

  if (!meta.alg) return { ...resource };

  return {
    ...resource,
    digestSRI: meta.toString(),
  };
}
