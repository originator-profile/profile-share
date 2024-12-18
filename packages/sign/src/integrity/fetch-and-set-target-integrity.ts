import type { RawTarget, Target } from "@originator-profile/model";
import type { HashAlgorithm } from "websri";
import { createIntegrity } from "./target-integrity";
import type { DocumentProvider } from "./types";

/**
 * 未署名 Content Attestation への Target Integrity の割り当て
 * @see {@link https://docs.originator-profile.org/rfc/target-guide/}
 * @example
 * ```ts
 * const uca = {
 *   // ...
 *   target: [
 *     {
 *       type: "<Target Integrityの種別>",
 *       cssSelector: "<CSS セレクター>",
 *     },
 *   ],
 * };
 *
 * await fetchAndSetTargetIntegrity("sha256", uca);
 *
 * console.log(uca.target);
 * // [
 * //   {
 * //     type: "<Target Integrityの種別>",
 * //     cssSelector: "<CSS セレクター>",
 * //     integrity: "sha256-..."
 * //   }
 * // ]
 * ```
 */
export async function fetchAndSetTargetIntegrity<
  T extends { target: ReadonlyArray<RawTarget> },
>(
  alg: HashAlgorithm,
  obj: T,
  documentProvider: DocumentProvider = async () => document,
): Promise<T & { target: ReadonlyArray<Target> }> {
  const target = await Promise.all(
    obj.target.map(async (raw: RawTarget, i) => {
      const doc = await documentProvider(raw);
      const target = await createIntegrity(alg, raw, doc);

      if (!target) {
        throw new Error(`Failed to create integrity #${i}.`);
      }

      return target;
    }),
  );

  return Object.assign(obj, { target });
}
