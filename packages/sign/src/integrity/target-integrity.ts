import type { RawTarget, Target } from "@originator-profile/model";
import { createIntegrityMetadata, type HashAlgorithm } from "websri";
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

/**
 * Target Integrity の作成
 * @see {@link https://docs.originator-profile.org/rfc/target-guide/}
 * @example
 * ```ts
 * const content = {
 *   type: "HtmlTargetIntegrity", // or ***TargetIntegrity
 *   cssSelector: "<CSS セレクター>",
 * };
 *
 * const { integrity } = await createIntegrity("sha256", content);
 * console.log(integrity); // sha256-...
 * ```
 */
export async function createIntegrity(
  alg: HashAlgorithm,
  { content = "", ...target }: RawTarget,
  doc = document,
): Promise<Target | null> {
  if (
    ![
      "TextTargetIntegrity",
      "VisibleTextTargetIntegrity",
      "HtmlTargetIntegrity",
      "ExternalResourceTargetIntegrity",
    ].includes(target.type)
  ) {
    return null;
  }

  if (target.type === "ExternalResourceTargetIntegrity") {
    const res = URL.canParse(content)
      ? await fetch(content)
      : new Response(content);

    const data = await res.arrayBuffer();
    const meta = await createIntegrityMetadata(alg, data);

    if (!meta.alg) return null;

    return {
      ...target,
      integrity: meta.toString(),
    } as Target;
  }

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
  }[target.type];

  const elements = elementSelector({ ...target, document: doc });

  if (elements.length === 0) return null;

  const [res] = await contentFetcher(elements);

  if (!res) return null;

  const data = await res.arrayBuffer();
  const meta = await createIntegrityMetadata(alg, data);

  if (!meta.alg) return null;

  return {
    ...target,
    integrity: meta.toString(),
  } as Target;
}
