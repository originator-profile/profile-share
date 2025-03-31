import fs from "fs";
import { execSync } from "child_process";
import sampleCAInfo from "../utils/sampleCAInfo";
import findHtmlFiles from "../utils/findHTMLFiles";

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

export default defineEventHandler(async () => {
  const { WEBROOT_PATH, VC_OUTPUT_PATH } = process.env;
  const docsPath = WEBROOT_PATH.endsWith("/")
    ? WEBROOT_PATH
    : `${WEBROOT_PATH}/`;
  const vcSourcesPath = VC_OUTPUT_PATH;
  const htmlFiles = await findHtmlFiles(docsPath);
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

    sampleCAInfo.credentialSubject["headline"] = title;
    sampleCAInfo.credentialSubject["description"] = description;
    sampleCAInfo.credentialSubject["datePublished"] = createdAt;
    sampleCAInfo.credentialSubject["dateModified"] = updatedAt;
    sampleCAInfo.credentialSubject["author"] = sampleCAInfo.credentialSubject[
      "editor"
    ] = lang === "ja" ? [opcipName.ja] : [opcipName.en];
    sampleCAInfo.credentialSubject["image"]["id"] = ogpImageURL[lang];

    const fullPath =
      origin + "/" + item.path.replace(docsPath, "").replace("index.html", "");

    sampleCAInfo.target = [primaryTarget];
    if (imageHashes) {
      sampleCAInfo.target.push(...imageHashes);
    }

    sampleCAInfo.allowedUrl.length = 0;
    sampleCAInfo.allowedUrl[0] = fullPath;
    arrowedURLOrigins.forEach((arrowedURLOrigin) => {
      const fullPath =
        arrowedURLOrigin +
        "/" +
        item.path
          .replace(docsPath, "")
          .replace("index.html", "")
          .replace(/\/$/, "(/?)");
      sampleCAInfo.allowedUrl.push(fullPath);
    });

    // ファイルを保存
    const outputFilePath = `${vcSourcesPath}${item.cas}.cas.json`;
    htmlFiles[index].vc_path = outputFilePath;
    fs.writeFileSync(outputFilePath, JSON.stringify(sampleCAInfo, null, 2));
  }
  return htmlFiles;
});
