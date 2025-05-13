import path from "path";
import fs from "fs";
import fastGlob from "fast-glob";
import { JSDOM } from "jsdom";
import crypto from "crypto";

export default async function findHtmlFiles({ docsPath, origin }) {
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

    const metaData = await extractInfoFromHtml(localFullPath, docsPath, origin);

    results.push({ cas, path: localFullPath, ...metaData });
  }
  return results;
}

async function extractInfoFromHtml(filepath, docsPath, origin) {
  //console.log(`filepath: ${filepath}, docsPath: ${docsPath}`);

  try {
    const htmlContent = fs.readFileSync(filepath, "utf8");
    const lang = filepath.indexOf("ja") !== -1 ? "ja" : "en";
    const { window } = new JSDOM(htmlContent);
    const { document } = window;
    if (!document.querySelector("title")) return;
    const title = document.querySelector("title").textContent || "No Title";
    if (!document.querySelector('meta[name="description"]')) return;
    const description =
      document
        .querySelector('meta[name="description"]')
        .getAttribute("content") || "No Description";
    const stats = fs.statSync(filepath);
    const datePublished = () => {
      const publishedElement = document.querySelector(".date-published");
      if (publishedElement && publishedElement.hasAttribute("datetime")) {
        return publishedElement.getAttribute("datetime");
      }

      const articlePublished = document.head.querySelector(
        '[property="article:published_time"]',
      );
      if (articlePublished && articlePublished.hasAttribute("content")) {
        return articlePublished.getAttribute("content");
      }

      return stats.birthtime.toISOString();
    };

    const dateUpdated = () => {
      const updated = document.head.querySelector(
        '[property="article:modified_time"]',
      );
      if (updated && updated.hasAttribute("content")) {
        return updated.getAttribute("content");
      }
      return stats.mtime.toISOString();
    };
    const createdAt = datePublished();
    const updatedAt = dateUpdated();

    // targetにHTMLを取得して設定

    const selector =
      "article [itemprop='headline'], article [itemprop='articleBody']";
    const content = document.querySelectorAll(selector);
    const elms = Array.from(content);
    const targetText = elms.map((e) => e.textContent).join("");
    const sha256 = targetText
      ? btoa(
          String.fromCharCode(
            ...new Uint8Array(
              await crypto.subtle.digest(
                "SHA-256",
                new TextEncoder().encode(targetText),
              ),
            ),
          ),
        )
      : null;

    const imageHashes = await fetchAndParse({ filepath, docsPath, origin });

    const primaryTarget = {
      type: "TextTargetIntegrity",
      cssSelector: selector,
      integrity: `sha256-${sha256}`,
    };

    return {
      title,
      description,
      createdAt,
      updatedAt,
      lang,
      primaryTarget,
      imageHashes,
    };
  } catch (error) {
    console.error("エラーが発生しました:", error);
    return {};
  }
}

async function fetchAndParse({ filepath, docsPath, origin }) {
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

    const elementsArray = Array.from(
      document.querySelectorAll(".target-integrity"),
    ).map((element) => {
      const src = element.getAttribute("src");
      const integrity = element.getAttribute("integrity");
      return { type: "ExternalResourceTargetIntegrity", integrity };
    });

    return elementsArray;
  } catch (error) {
    console.error("HTMLの取得とパースに失敗しました:", error);
    throw error;
  }
}
