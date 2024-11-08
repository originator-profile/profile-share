import type { Target } from "@originator-profile/model";
import {
  fetchExternalResource,
  fetchHtmlContent,
  fetchTextContent,
  fetchVisibleTextContent,
  selectByCss,
  selectByIntegrity,
  type ContentFetcher,
  type ElementSelector,
} from "@originator-profile/sign";
import { createIntegrityMetadata, IntegrityMetadata } from "websri";

class IntegrityVerifier {
  constructor(
    private contentFetcher: ContentFetcher,
    private elementSelector: ElementSelector,
  ) {}

  async verify(
    content: { cssSelector?: string; integrity: string },
    document: Document,
  ): Promise<boolean> {
    const integrity = new IntegrityMetadata(content.integrity);
    const alg = integrity.alg;

    if (!alg) return false;

    const elements = this.elementSelector({ ...content, document });

    if (elements.length === 0) return false;

    const responses = await this.contentFetcher(elements);

    const meta = await Promise.all(
      responses.map(async (res) => {
        const data = await res.arrayBuffer();

        return await createIntegrityMetadata(alg, data);
      }),
    );

    return meta.every((m) => m.match(integrity));
  }
}

/**
 * Target Integrity の検証
 * @see {@link https://next.docs-originator-profile-org.pages.dev/rfc/target-guide/}
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
): Promise<boolean> {
  const { contentFetcher, elementSelector } = {
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
  }[content.type];

  const integrityVerifier = new IntegrityVerifier(
    contentFetcher,
    elementSelector,
  );

  return await integrityVerifier.verify(content, doc);
}
