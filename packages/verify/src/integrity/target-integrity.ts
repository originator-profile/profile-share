import type { Target } from "@originator-profile/model";
import { createIntegrityMetadata, IntegrityMetadata } from "websri";
import type { ContentFetcher, ElementSelector } from "./types";

/** element.outerHTML and join("") */
export const fetchHtmlContent: ContentFetcher = async (elements) => {
  const text: string = elements
    .map((element): string => element.outerHTML)
    .join("");

  return [new Response(text)];
};

/** element.textContent and join("") */
export const fetchTextContent: ContentFetcher = async (elements) => {
  const text: string = elements
    .map((element): string => element.textContent ?? "")
    .join("");

  return [new Response(text)];
};

/** element.innerText and join("") */
export const fetchVisibleTextContent: ContentFetcher = async (elements) => {
  const text: string = elements
    .map((element): string => element.innerText)
    .join("");

  return [new Response(text)];
};

/** await fetch(element.src) */
export const fetchExternalResource: ContentFetcher = async (
  elements,
  fetcher = fetch,
) => {
  return await Promise.all(
    elements.map(async (element: unknown) => {
      return await fetcher((element as { src: string }).src);
    }),
  );
};

export const selectByCss: ElementSelector = (params) => {
  return Array.from(
    params.document.querySelectorAll(params.cssSelector as string),
  );
};

export const selectByIntegrity: ElementSelector = (params) => {
  return selectByCss({
    ...params,
    cssSelector: `[integrity=${JSON.stringify(String(params.integrity))}]`,
  });
};

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
