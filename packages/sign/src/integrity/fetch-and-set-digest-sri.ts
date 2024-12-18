import type { HashAlgorithm } from "websri";
import { createDigestSri } from "./digest-sri";
import type { DigestSriContent } from "./types";

/**
 * オブジェクトへの `digestSRI` の割り当て
 * @see {@link https://www.w3.org/TR/SRI/#the-integrity-attribute}
 * @example
 * ```ts
 * const resource = {
 *   id: "<URL>",
 * };
 *
 * await fetchAndSetDigestSri("sha256", resource);
 *
 * console.log(resource);
 * // {
 * //   id: "<URL>",
 * //   digestSRI: "sha256-..."
 * // }
 * ```
 */
export async function fetchAndSetDigestSri(
  alg: HashAlgorithm,
  content: unknown,
): Promise<DigestSriContent | undefined> {
  if (!content) return content as undefined;

  if (typeof (content as DigestSriContent).digestSRI !== "string") {
    Object.assign(
      content as DigestSriContent,
      await createDigestSri(alg, content as DigestSriContent),
    );
  }

  return content as DigestSriContent;
}
