import { Profile } from "../types/profile";
import { ProfileGenericError } from "@webdino/profile-verify";

/**
 * ProfileGenericError を検出する関数
 * @param profiles Profile の配列
 * @returns result ProfileGenericError
 */
export default function findProfileGenericError(
  profiles: Profile[]
): ProfileGenericError | undefined {
  const profile = profiles.find((profile) => "error" in profile);
  return profile?.error;
}
