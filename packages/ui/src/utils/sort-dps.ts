import { Dp } from "../types/profile";

const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
  const result = [...list];
  const removed = result.splice(startIndex, 1);
  result.splice(endIndex, 0, ...removed);
  return result;
};

/** Dp の並びを整列する関数
 * @param dps Dp の配列
 * @param main メインの出版物 (Dp 識別子)
 * @returns 整列済みの Dp の配列
 */
export default function sortDps(dps: Dp[], main: string[]): Dp[] {
  const mainIndex = dps.findIndex((dp) => dp.subject === main[0]);
  if (mainIndex !== -1) return reorder(dps, mainIndex, 0);
  return dps;
}
