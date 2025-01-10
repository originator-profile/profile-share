import { Dp } from "@originator-profile/model";
import { DpItemContent } from "@originator-profile/core";
import { DocumentProfile } from "./profile";

/**
 * Profile Set あるいは Ad Profile Pair から得られる Dp のコンテンツの種別を得る関数
 * リターン値は種別をあらわす値である。ラベルとして使用する際にはメッセージカタログで変換すること
 * @deprecated
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
  if (main.includes(dp.subject)) return "ContentType_MainContent";
  if (item.type === "website") return "ContentType_Article";
  if (item.type === "advertisement") return "ContentType_Advertisement";
  return "ContentType_Unknown";
}
