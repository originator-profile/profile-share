import {
  createDigestSri,
  type DigestSriContent,
} from "@originator-profile/sign";
import { IntegrityMetadata } from "websri";

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

  const { digestSRI } = await createDigestSri(digestSri.alg, content, fetcher);

  return digestSri.match(digestSRI);
}
