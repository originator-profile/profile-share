import { Profile, Op, Dp } from "@originator-profile/model";

/**
 * Profile が Op 型であるか否か
 * @param profile
 * @return Op 型であれば true、それ以外ならば false
 */
export function isOp<T extends Op>(profile: Profile): profile is T {
  return profile.type === Op.properties.type.const;
}

/**
 * Profile が Dp 型であるか否か
 * @param profile
 * @return Dp 型であれば true、それ以外ならば false
 */
export function isDp<T extends Dp>(profile: Profile): profile is T {
  return profile.type === Dp.properties.type.const;
}
