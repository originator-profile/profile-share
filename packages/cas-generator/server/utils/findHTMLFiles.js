import path from "path";
import fs from "fs";
import fastGlob from "fast-glob";
import { JSDOM } from "jsdom";
import crypto from "crypto";

export default async function findHtmlFiles(dir) {
  const list = await fastGlob(["**/*.html"], { cwd: dir });
  const results = [];

  for (let i = 0; i < list.length; i++) {
    const file = list[i];
    const fullPath = path.join(dir, file);
    const cas = fullPath
      .replace("index.html", "")
      .replace(dir, "")
      .replace(/\//g, ".")
      .replace(/\.$/, "");

    const metaData = await extractInfoFromHtml(fullPath, dir);

    results.push({ cas, path: fullPath, ...metaData });
  }
  return results;
}

async function extractInfoFromHtml(filepath, dir) {
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
    console.log(createdAt);

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

    const images = document.querySelectorAll(".target-integrity");
    const imageHashes = await Promise.all(
      Array.from(images).map(async (img) => {
        const imagePath = path.join(dir, img.getAttribute("src"));

        try {
          const imageBuffer = await fs.promises.readFile(imagePath);
          const hash = crypto.createHash("sha256");
          hash.update(imageBuffer);
          const val = hash.digest("base64");

          return {
            type: "ExternalResourceTargetIntegrity",
            integrity: `sha256-${val}`,
          };
        } catch (error) {
          console.error(`画像の読み込みに失敗しました: ${imagePath}`, error);
          return null;
        }
      }),
    );

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
