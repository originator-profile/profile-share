import useSWR from "swr";
import fetcher from "./fetcher";

/**
 * バージョン情報の型定義
 */
export type VersionInfo = {
  version: string;
  commitHash: string;
  prismaMigration: string;
};

/**
 * バージョン情報を取得するカスタムフック
 */
export function useVersionInfo() {
  return useSWR({ url: "/internal/versions/" }, fetcher<VersionInfo>);
}
