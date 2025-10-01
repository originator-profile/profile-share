import { execSync } from "node:child_process";
import { platform } from "node:os";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// LC_ALL環境変数からロケールを取得（デフォルトはja_JP.UTF-8）
function getTargetLocale(): string {
  const lcAll = process.env.LC_ALL || "ja_JP.UTF-8";
  // LC_ALLから言語コードを抽出（例: ja_JP.UTF-8 -> ja-JP）
  const langCode = (lcAll.split(".")[0] || "ja_JP").replace("_", "-");
  return langCode;
}

// 現在のブラウザ言語設定を取得
function getCurrentLanguage(
  browser: "chromium" | "chrome",
): string | undefined {
  const domain =
    browser === "chromium" ? "org.chromium.Chromium" : "com.google.Chrome";
  try {
    return execSync(`defaults read ${domain} AppleLanguages 2>/dev/null`, {
      encoding: "utf-8",
    }).trim();
  } catch {
    return undefined;
  }
}

// ブラウザの言語設定を変更
function setLanguage(browser: "chromium" | "chrome", locale: string): void {
  const domain =
    browser === "chromium" ? "org.chromium.Chromium" : "com.google.Chrome";
  execSync(`defaults write ${domain} AppleLanguages '("${locale}")'`);
}

// バックアップファイルを保存
function saveBackup(
  browser: "chromium" | "chrome",
  currentLanguages: string | undefined,
): void {
  const tempDir = join(process.cwd(), ".e2e-temp");
  mkdirSync(tempDir, { recursive: true });

  const backupFile = join(tempDir, `${browser}-language-backup.json`);
  writeFileSync(
    backupFile,
    JSON.stringify({ originalLanguages: currentLanguages }),
    "utf-8",
  );
}

// ブラウザの言語設定をセットアップ
function setupBrowserLanguage(
  browser: "chromium" | "chrome",
  targetLocale: string,
): void {
  const browserName = browser === "chromium" ? "Chromium" : "Chrome";

  const currentLanguages = getCurrentLanguage(browser);
  console.log(
    `現在の${browserName}言語設定:`,
    currentLanguages || "なし（システムデフォルト）",
  );

  saveBackup(browser, currentLanguages);
  setLanguage(browser, targetLocale);

  const newLanguages = getCurrentLanguage(browser);
  console.log(
    `${browserName}の言語設定を${targetLocale}に変更しました:`,
    newLanguages,
  );
}

async function globalSetup() {
  if (platform() !== "darwin") {
    console.log(
      "Linux/CI環境を検出しました。環境変数LC_ALLで言語設定を制御します。",
    );
    return;
  }

  console.log("macOS環境を検出しました。E2Eテスト用に言語設定を調整します...");

  const targetLocale = getTargetLocale();
  console.log(
    `目標ロケール: ${targetLocale} (LC_ALL=${process.env.LC_ALL || "デフォルト"})`,
  );

  try {
    // Chromiumの設定
    setupBrowserLanguage("chromium", targetLocale);

    // Chromeの設定（インストールされている場合）
    try {
      setupBrowserLanguage("chrome", targetLocale);
    } catch {
      // Chromeがインストールされていない場合は無視
    }
  } catch (error) {
    console.warn("言語設定の変更に失敗しました:", error);
    console.warn("   E2Eテストが失敗する可能性があります。");
    console.warn(`   手動で以下のコマンドを実行してください:`);
    console.warn(
      `   defaults write org.chromium.Chromium AppleLanguages '("${targetLocale}")'`,
    );
  }
}

export default globalSetup;
