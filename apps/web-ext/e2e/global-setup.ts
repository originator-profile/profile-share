import { execSync } from "node:child_process";
import { platform } from "node:os";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

async function globalSetup() {
  // macOS環境でのみ言語設定を変更
  if (platform() === "darwin") {
    console.log(
      "macOS環境を検出しました。E2Eテスト用に言語設定を調整します...",
    );

    try {
      // 現在の言語設定をバックアップ
      let currentLanguages: string | undefined;
      try {
        currentLanguages = execSync(
          "defaults read org.chromium.Chromium AppleLanguages 2>/dev/null",
          { encoding: "utf-8" },
        ).trim();
        console.log("現在のChromium言語設定:", currentLanguages);
      } catch {
        // 設定が存在しない場合はundefined
        currentLanguages = undefined;
        console.log("現在のChromium言語設定: なし（システムデフォルト）");
      }

      // バックアップを一時ファイルに保存
      const tempDir = join(process.cwd(), ".e2e-temp");
      mkdirSync(tempDir, { recursive: true });

      const backupFile = join(tempDir, "chromium-language-backup.json");
      writeFileSync(
        backupFile,
        JSON.stringify({ originalLanguages: currentLanguages }),
        "utf-8",
      );

      // Chromium用の日本語設定を適用
      execSync(
        "defaults write org.chromium.Chromium AppleLanguages '(\"ja-JP\")'",
      );

      // 設定変更を確認
      const newLanguages = execSync(
        "defaults read org.chromium.Chromium AppleLanguages 2>/dev/null",
        { encoding: "utf-8" },
      ).trim();
      console.log("✅ Chromiumの言語設定を日本語に変更しました:", newLanguages);

      // Chrome用の設定も同様に適用（インストールされている場合）
      try {
        let chromeLanguages: string | undefined;
        try {
          chromeLanguages = execSync(
            "defaults read com.google.Chrome AppleLanguages 2>/dev/null",
            { encoding: "utf-8" },
          ).trim();
          console.log("現在のChrome言語設定:", chromeLanguages);
        } catch {
          chromeLanguages = undefined;
          console.log("現在のChrome言語設定: なし（システムデフォルト）");
        }

        const chromeBackupFile = join(tempDir, "chrome-language-backup.json");
        writeFileSync(
          chromeBackupFile,
          JSON.stringify({ originalLanguages: chromeLanguages }),
          "utf-8",
        );

        execSync(
          "defaults write com.google.Chrome AppleLanguages '(\"ja-JP\")'",
        );

        const newChromeLanguages = execSync(
          "defaults read com.google.Chrome AppleLanguages 2>/dev/null",
          { encoding: "utf-8" },
        ).trim();
        console.log(
          "✅ Chromeの言語設定も日本語に変更しました:",
          newChromeLanguages,
        );
      } catch {
        // Chromeがインストールされていない場合は無視
      }
    } catch (error) {
      console.warn("⚠️ 言語設定の変更に失敗しました:", error);
      console.warn("   E2Eテストが失敗する可能性があります。");
      console.warn("   手動で以下のコマンドを実行してください:");
      console.warn(
        "   defaults write org.chromium.Chromium AppleLanguages '(\"ja-JP\")'",
      );
    }
  } else {
    console.log(
      "Linux/CI環境を検出しました。環境変数LC_ALLで制御しているため、言語設定の変更は行いません。",
    );
  }
}

export default globalSetup;
