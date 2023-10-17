import { Profile } from "../types/profile";
import { ProfileError } from "@originator-profile/ui/src/types";

/**
 * エラーを検出する関数
 * @param profiles Profile の配列
 * @param error ProfileGenericError を継承するエラーオブジェクト
 * @returns result ProfileGenericError
 */
export default function findProfileError(
  profiles: Profile[],
): ProfileError | undefined {
  const profile = profiles.find((profile) => "error" in profile);
  return profile?.error;
}
