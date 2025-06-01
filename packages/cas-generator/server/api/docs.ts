import fs from "fs";
import { execSync } from "child_process";
import findHtmlFiles from "../utils/findHTMLFiles";
import { createDefaultContentAttestation } from "../domain/contentAttestation";

const origin = "https://originator-profile.org";

const arrowedURLOrigins = [
  "http://localhost:4321",
  "https://cas-all-contents-date.originator-profile-org.pages.dev",
];

const opcipName = {
  ja: "Originator Profile 技術研究組合",
  en: "Originator Profile Collaborative Innovation Partnership",
};

const ogpImageURL = {
  ja: "https://originator-profile.org/ogp-ja.png",
  en: "https://originator-profile.org/ogp-en.png",
};

export default defineEventHandler(async (event) => {
  // runtimeConfigから環境変数を取得
  const config = useRuntimeConfig(event);
  const WEBROOT_PATH = config.WEBROOT_PATH;
  const VC_OUTPUT_PATH = config.VC_OUTPUT_PATH;

  if (!WEBROOT_PATH || !VC_OUTPUT_PATH) {
    throw createError({
      statusCode: 500,
      message: "必要な環境変数が設定されていません",
    });
  }

  const docsPath = WEBROOT_PATH.endsWith("/")
    ? WEBROOT_PATH
    : `${WEBROOT_PATH}/`;
  const vcSourcesPath = VC_OUTPUT_PATH;
  const htmlFiles = await findHtmlFiles({ docsPath, origin });
  console.log(htmlFiles.length + "件のHTMLファイルが見つかりました");

  // CAの情報を定義する

  // ファイル生成場所内を空っぽにする
  execSync(`rm -rf ${vcSourcesPath}*`);

  // ファイルをループ生成して保存する
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

    const fullPath =
      origin + "/" + item.path.replace(docsPath, "").replace("index.html", "");
    const allowedUrl = [fullPath];
    for (const arrowedURLOrigin of arrowedURLOrigins) {
      const formattedPath =
        arrowedURLOrigin +
        "/" +
        item.path
          .replace(docsPath, "")
          .replace("index.html", "")
          .replace(/\/$/, "(/?)");
      allowedUrl.push(formattedPath);
    }

    const caInfo = createDefaultContentAttestation({
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
    });

    // ファイルを保存
    const outputFilePath = `${vcSourcesPath}${item.cas}.cas.json`;
    htmlFiles[index].vc_path = outputFilePath;
    fs.writeFileSync(outputFilePath, JSON.stringify(caInfo, null, 2));
  }
  return htmlFiles;
});
