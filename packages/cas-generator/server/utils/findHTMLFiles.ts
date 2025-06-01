import path from "path";
import fs from "fs";
import fastGlob from "fast-glob";
import { JSDOM } from "jsdom";
import crypto from "crypto";
import {
  OpSiteInfo,
  getCreatedAt,
  getUpdatedAt,
  ImageHash,
  getImageHashes,
} from "../domain/originatorProfileSite";
import { TargetIntegrity } from "../domain/contentAttestation";

export default async function findHtmlFiles({
  docsPath,
  origin,
}: {
  docsPath: string;
  origin: string;
}): Promise<OpSiteInfo[]> {
  const list = await fastGlob(["**/*.html"], { cwd: docsPath });
  const results = [];

  for (let i = 0; i < list.length; i++) {
    const file = list[i];
    const localFullPath = path.join(docsPath, file);
    const cas = localFullPath
      .replace("index.html", "")
      .replace(docsPath, "")
      .replace(/\//g, ".")
      .replace(/\.$/, "");

    const metaData = await extractInfoFromHtml({
      filepath: localFullPath,
      docsPath,
      origin,
    });
    if (!metaData) {
      console.log(`${localFullPath}はメタデータが取得できませんでした`);
      continue;
    }

    results.push({ ...metaData, cas, path: localFullPath });
  }
  return results;
}

async function extractInfoFromHtml({
  filepath,
  docsPath,
  origin,
}: {
  filepath: string;
  docsPath: string;
  origin: string;
}): Promise<Omit<OpSiteInfo, "cas" | "path"> | null> {
  try {
    const htmlContent = fs.readFileSync(filepath, "utf8");
    const { window } = new JSDOM(htmlContent);
    const { document } = window;

    if (!document.querySelector("title")) {
      console.log(`${filepath}はtitleが取得できませんでした`);
      return null;
    }
    const title = document.querySelector("title")?.textContent || "No Title";
    if (!document.querySelector('meta[name="description"]')) {
      console.log(`${filepath}はdescriptionが取得できませんでした`);
      return null;
    }
    const description =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content") || "No Description";

    const stats = fs.statSync(filepath);
    const createdAt = getCreatedAt(stats.birthtime.toISOString(), document);
    const updatedAt = getUpdatedAt(stats.mtime.toISOString(), document);
    const lang = filepath.indexOf("ja") !== -1 ? "ja" : "en";

    // targetにHTMLを取得して設定
    const selector =
      "article [itemprop='headline'], article [itemprop='articleBody']";
    const content = document.querySelectorAll(selector);
    const elms = Array.from(content);
    const targetText = elms.map((e) => e.textContent).join("");
    const sha256 = btoa(
      String.fromCharCode(
        ...new Uint8Array(
          await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(targetText || ""),
          ),
        ),
      ),
    );

    const primaryTarget: TargetIntegrity = {
      type: "TextTargetIntegrity",
      cssSelector: selector,
      integrity: `sha256-${sha256}`,
    };
    const imageHashes = await fetchAndParse({ filepath, docsPath, origin });
    if (!imageHashes) {
      console.log(`${filepath}は画像ハッシュが取得できませんでした`);
      return null;
    }

    return {
      title,
      description,
      createdAt,
      updatedAt,
      lang,
      primaryTarget,
      imageHashes,
      // ここでは空文字を設定, 後でコントローラーで設定する
      vc_path: "",
    };
  } catch (error) {
    console.error("エラーが発生しました:", error);
    return null;
  }
}

/**
 * HTMLファイルを取得して、画像ハッシュを取得します。
 * @param filepath - ファイルのパス
 * @param docsPath - ドキュメントのパス
 * @param origin - オリジン
 * @returns 画像ハッシュの配列
 */
async function fetchAndParse({
  filepath,
  docsPath,
  origin,
}: {
  filepath: string;
  docsPath: string;
  origin: string;
}): Promise<ImageHash[] | null> {
  try {
    // URLを構築
    const url = new URL(
      filepath.replace(docsPath, "").replace("index.html", ""),
      origin,
    ).toString();

    // HTMLを取得
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, URL: ${url}`);
    }
    const html = await response.text();

    // JSDOMでパース
    const dom = new JSDOM(html, {
      url: url, // 相対パスを解決するために必要
      referrer: origin,
      contentType: "text/html",
    });

    const { document } = dom.window;

    const imageHashes = await getImageHashes(filepath, document);

    return imageHashes;
  } catch (error) {
    console.error("HTMLの取得とパースに失敗しました:", error);
    return null;
  }
}
