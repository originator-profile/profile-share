import { createIntegrityMetadata, IntegrityMetadata } from "websri";
import type { DigestSriContent } from "./types";

/**
 * `digestSRI` の検証
 * @see {@link https://www.w3.org/TR/SRI/#the-integrity-attribute}
 * @example
 * ```ts
 * const content: DigestSriContent = {
 *   id: "<URL>",
 *   digestSRI: "sha256-...",
 * };
 *
 * await verifyDigestSri(content); // true or false
 * ```
 */
export async function verifyDigestSri(
  content: DigestSriContent,
  fetcher = fetch,
): Promise<boolean> {
  const digestSri = new IntegrityMetadata(content.digestSRI);

  if (!digestSri.alg) return false;

  const res = await fetcher(content.id);
  const data = await res.arrayBuffer();
  const meta = await createIntegrityMetadata(digestSri.alg, data);

  return meta.match(digestSri);
}
