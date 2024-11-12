import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { execSync } from "child_process";
import { resolve } from "path";
import pkg from "../package.json";

const getGitCommitHash = () => {
  try {
    return execSync("git rev-parse HEAD").toString().trim();
  } catch {
    return "unknown";
  }
};

const getPackageVersion = () => {
  try {
    return pkg.version || "unknown";
  } catch {
    return "unknown";
  }
};

const getPrismaMigrationName = () => {
  try {
    const migrationsDir = resolve(__dirname, "../../prisma/migrations");
    const migrations = execSync(`ls ${migrationsDir}`)
      .toString()
      .trim()
      .split("\n");

    // `migration_lock.toml` を除外
    const filteredMigrations = migrations.filter(
      (name) => !name.includes("migration_lock.toml"),
    );
    const latestMigration = filteredMigrations.at(-1);

    // 日付部分 (YYYYMMDDHHMMSS) を抽出
    return latestMigration?.match(/^\d{14}/)?.[0] ?? "unknown";
  } catch {
    return "unknown";
  }
};

const callback: FastifyPluginAsync = async (app) => {
  Object.assign(app.config, {
    APP_VERSION: getPackageVersion(),
    GIT_COMMIT_HASH: getGitCommitHash(),
    PRISMA_MIGRATION: getPrismaMigrationName(),
  });
};

export const versionInfo = fp(callback, {
  name: "version-info",
});
