import { execSync } from "node:child_process";
import { platform } from "node:os";
import { readFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

async function globalTeardown() {
  // macOS環境でのみ言語設定を復元
  if (platform() === "darwin") {
    console.log("🔧 E2Eテスト終了。言語設定を復元します...");

    const tempDir = join(process.cwd(), ".e2e-temp");

    try {
      // Chromiumの設定を復元
      const backupFile = join(tempDir, "chromium-language-backup.json");
      if (existsSync(backupFile)) {
        const backup = JSON.parse(readFileSync(backupFile, "utf-8"));

        if (backup.originalLanguages === undefined) {
          // 元々設定が存在しなかった場合は削除
          try {
            execSync("defaults delete org.chromium.Chromium AppleLanguages 2>/dev/null");
            console.log("✅ Chromiumの言語設定を削除しました（元の状態に復元）");
          } catch {
            // 削除に失敗した場合は無視（既に削除されている可能性）
          }
        } else {
          // 元の設定を復元
          execSync(`defaults write org.chromium.Chromium AppleLanguages '${backup.originalLanguages}'`);
          console.log("✅ Chromiumの言語設定を復元しました");
        }
      }

      // Chromeの設定を復元
      const chromeBackupFile = join(tempDir, "chrome-language-backup.json");
      if (existsSync(chromeBackupFile)) {
        const backup = JSON.parse(readFileSync(chromeBackupFile, "utf-8"));

        if (backup.originalLanguages === undefined) {
          // 元々設定が存在しなかった場合は削除
          try {
            execSync("defaults delete com.google.Chrome AppleLanguages 2>/dev/null");
            console.log("✅ Chromeの言語設定を削除しました（元の状態に復元）");
          } catch {
            // 削除に失敗した場合は無視
          }
        } else {
          // 元の設定を復元
          execSync(`defaults write com.google.Chrome AppleLanguages '${backup.originalLanguages}'`);
          console.log("✅ Chromeの言語設定を復元しました");
        }
      }

      // 一時ファイルをクリーンアップ
      if (existsSync(tempDir)) {
        rmSync(tempDir, { recursive: true, force: true });
      }

    } catch (error) {
      console.error("⚠️ 言語設定の復元に失敗しました:", error);
      console.error("   手動で設定を確認してください。");
      console.error("   確認コマンド: defaults read org.chromium.Chromium AppleLanguages");
    }
  }
}

export default globalTeardown;