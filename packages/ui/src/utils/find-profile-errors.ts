import { Profile, ProfileError } from "../types/profile";
import { ProfileGenericError } from "@originator-profile/verify";

/**
 * エラーを検出する関数
 * @param profiles Profile の配列
 * @returns result エラーの配列
 */
export default function findProfileErrors(profiles: Profile[]): ProfileError[] {
  return profiles
    .map((profile) => profile.error)
    .filter(
      (error): error is ProfileError => error instanceof ProfileGenericError,
    );
}
