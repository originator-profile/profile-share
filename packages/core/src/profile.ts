import { Profile, Op, Dp, OriginatorProfile } from "@originator-profile/model";

/**
 * Profile が Op 型であるか否か
 * @deprecated
 * @param profile
 * @return Op 型であれば true、それ以外ならば false
 */
export function isOp(profile: Profile): profile is Op {
  return profile.type === Op.properties.type.const;
}

/**
 * Profile が Dp 型であるか否か
 * @deprecated
 * @param profile
 * @return Dp 型であれば true、それ以外ならば false
 */
export function isDp(profile: Profile): profile is Dp {
  return profile.type === Dp.properties.type.const;
}

/**
 * Profile が OriginatorProfile 型であるか否か
 * @param profile
 * @return OriginatorProfile 型であれば true、それ以外ならば false
 */
export function isSdJwtOp(
  profile: Profile | OriginatorProfile,
): profile is OriginatorProfile {
  return (
    "vct" in profile &&
    profile.vct === "https://originator-profile.org/organization"
  );
}
