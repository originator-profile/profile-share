import { TargetIntegrity } from "./contentAttestation";

type Lang = "ja" | "en";

export type ImageHash = {
  type: TargetIntegrity["type"];
  integrity: string;
};

export type OpSiteInfo = {
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  lang: Lang;
  primaryTarget: TargetIntegrity;
  imageHashes: ImageHash[];
  cas: string;
  path: string;
  vc_path: string;
};

export const getCreatedAt = (
  defaultDate: string,
  document: Document,
): string => {
  const publishedElement = document.querySelector(".date-published");
  if (publishedElement) {
    return publishedElement.getAttribute("datetime") || defaultDate;
  }

  const articlePublished = document.querySelector(
    '[property="article:published_time"]',
  );
  if (articlePublished) {
    return articlePublished.getAttribute("content") || defaultDate;
  }

  return defaultDate;
};

export const getUpdatedAt = (
  defaultDate: string,
  document: Document,
): string => {
  const updated = document.querySelector('[property="article:modified_time"]');
  return updated?.getAttribute("content") || defaultDate;
};

export const getImageHashes = async (
  filepath: string,
  document: Document,
): Promise<ImageHash[]> => {
  const elementsArray = Array.from(
    document.querySelectorAll(".target-integrity"),
  )
    .map((element) => {
      const integrity = element.getAttribute("integrity");
      if (!integrity) {
        console.log(`${filepath}はintegrityが取得できませんでした`);
        return null;
      }
      return { type: "ExternalResourceTargetIntegrity", integrity };
    })
    .filter((hash): hash is ImageHash => hash !== null);

  return elementsArray;
};
