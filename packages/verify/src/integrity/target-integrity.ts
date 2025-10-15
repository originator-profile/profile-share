import type { Target } from "@originator-profile/model";
import {
  type ContentFetcher,
  type ElementSelector,
  fetchExternalResource,
  fetchHtmlContent,
  fetchTextContent,
  fetchVisibleTextContent,
  selectByCss,
  selectByIntegrity,
} from "@originator-profile/sign";
import { createIntegrityMetadataSet, IntegrityMetadataSet } from "websri";

export type IntegrityVerifyResult = {
  valid: boolean;
  failedIntegrities: ReadonlyArray<string>;
};

class IntegrityVerifier {
  constructor(
    private contentFetcher: ContentFetcher,
    private elementSelector: ElementSelector,
  ) {}

  async verify(
    content: { cssSelector?: string; integrity: string },
    document: Document,
  ): Promise<IntegrityVerifyResult> {
    const integrity = new IntegrityMetadataSet(content.integrity);
    const alg = [...integrity].flatMap((m) => (m.alg ? [m.alg] : []));

    if (alg.length === 0) return { valid: false, failedIntegrities: [] };

    const elements = this.elementSelector({ ...content, document });

    if (elements.length === 0) return { valid: false, failedIntegrities: [] };

    const responses = await this.contentFetcher(elements);

    const meta = await Promise.all(
      responses.map(async (res) => {
        const data = await res.arrayBuffer();

        return await createIntegrityMetadataSet(alg, data);
      }),
    );

    const failedIntegrities = meta
      .filter((m) => [...m].every((m) => !integrity.match(m)))
      .map((m) => m.toString());

    return { valid: failedIntegrities.length === 0, failedIntegrities };
  }
}

/** Target Integrity のコンテンツ取得・要素位置特定アルゴリズム */
export const TargetIntegrityAlgorithm = {
  HtmlTargetIntegrity: {
    contentFetcher: fetchHtmlContent,
    elementSelector: selectByCss,
  },
  TextTargetIntegrity: {
    contentFetcher: fetchTextContent,
    elementSelector: selectByCss,
  },
  VisibleTextTargetIntegrity: {
    contentFetcher: fetchVisibleTextContent,
    elementSelector: selectByCss,
  },
  ExternalResourceTargetIntegrity: {
    contentFetcher: fetchExternalResource,
    elementSelector: selectByIntegrity,
  },
};

/**
 * Target Integrity の検証
 * @see {@link https://docs.originator-profile.org/rfc/target-guide/}
 * @example
 * ```ts
 * const content = {
 *   type: "HtmlTargetIntegrity", // or ***TargetIntegrity
 *   cssSelector: "<CSS セレクター>",
 *   integrity: "sha256-...",
 * };
 *
 * await verifyIntegrity(content); // true or false
 * ```
 */
export async function verifyIntegrity(
  content: Target,
  doc = document,
  fetcher = fetch,
): Promise<IntegrityVerifyResult> {
  const { contentFetcher, elementSelector } =
    TargetIntegrityAlgorithm[content.type];

  const integrityVerifier = new IntegrityVerifier(
    (content) => contentFetcher(content, fetcher),
    elementSelector,
  );

  return await integrityVerifier.verify(content, doc);
}

export type VerifyIntegrity = typeof verifyIntegrity;
