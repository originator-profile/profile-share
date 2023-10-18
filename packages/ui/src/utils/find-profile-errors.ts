import { Profile } from "../types/profile";
import { ProfileGenericError } from "@originator-profile/verify";
import { ProfileError } from "@originator-profile/ui/src/types";

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
