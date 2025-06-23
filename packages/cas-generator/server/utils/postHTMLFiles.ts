import fs from "fs";
import { OpSiteInfo } from "../domain/originatorProfileSite";
import { createDefaultContentAttestation } from "../domain/contentAttestation";

type PostHTMLFilesParams = {
  htmlFiles: OpSiteInfo[];
  docsPath: string;
  vcSourcesPath: string;
  allowedURLOrigins: string[];
  opcipName: { ja: string; en: string };
  ogpImageURL: { ja: string; en: string };
};

/**
 * casPath　にファイルを生成するのに必要な前準備として、環境変数 vcSourcesPath にファイルを保存するための関数
 * @param PostHTMLFilesParams
 * @returns Promise<OpSiteInfo[]>
 */
export default async function postHTMLFiles({
  htmlFiles,
  docsPath,
  vcSourcesPath,
  allowedURLOrigins,
  opcipName,
  ogpImageURL,
}: PostHTMLFilesParams): Promise<OpSiteInfo[]> {
  const processedFiles = [...htmlFiles];

  for await (const [index, item] of htmlFiles.entries()) {
    const {
      title,
      description,
      createdAt,
      updatedAt,
      lang,
      primaryTarget,
      imageHashes,
    } = item;

    const allowedUrl: string[] = [];
    for (const allowedURLOrigin of allowedURLOrigins) {
      const formattedPath =
        allowedURLOrigin +
        "/" +
        item.path
          .replace(docsPath, "")
          .replace("index.html", "")
          .replace(/\/$/, "(/?)");
      allowedUrl.push(formattedPath);
    }

    const caInfo = createDefaultContentAttestation(
      {
        credentialSubject: {
          type: "Article",
          headline: title,
          image: {
            id: ogpImageURL[lang],
          },
          description: description,
          author: [opcipName[lang]],
          editor: [opcipName[lang]],
          datePublished: createdAt,
          dateModified: updatedAt,
          genre: "technology",
        },
        allowedUrl: allowedUrl,
        target: [primaryTarget, ...imageHashes],
      },
      lang,
    );

    // ファイルを保存
    const outputFilePath = `${vcSourcesPath}${item.cas}.cas.json`;
    processedFiles[index].vc_path = outputFilePath;
    fs.writeFileSync(outputFilePath, JSON.stringify(caInfo, null, 2));
  }

  return processedFiles;
}
