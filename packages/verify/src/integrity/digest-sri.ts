import {
  createDigestSri,
  type DigestSriContent,
} from "@originator-profile/sign";
import { IntegrityMetadataSet } from "websri";

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
  const integrity = new IntegrityMetadataSet(content.digestSRI);
  const alg = integrity.strongestHashAlgorithms.filter(Boolean);

  if (alg.length === 0) return false;

  const { digestSRI } = await createDigestSri(alg[0], content, fetcher);

  return integrity.match(digestSRI);
}
