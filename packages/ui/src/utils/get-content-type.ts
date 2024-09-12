import { Dp } from "@originator-profile/model";
import { DpItemContent } from "@originator-profile/core";
import { DocumentProfile } from "./profile";

/**
 * Profile Set あるいは Ad Profile Pair から得られる Dp のコンテンツの種別を得る関数
 * @param dp Dp
 * @param item Website あるいは Advertisement
 * @param main メインコンテンツの subject の配列
 * @return コンテンツの種別
 */
export default function getContentType(
  dp: Dp | DocumentProfile,
  item: DpItemContent,
  main: string[],
) {
  if (main.includes(dp.subject)) return "メインコンテンツ";
  if (item.type === "website") return "記事";
  if (item.type === "advertisement") return "広告";
  return "種別不明のコンテンツ";
}
