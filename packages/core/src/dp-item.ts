import {
  DpItem,
  DpVisibleText,
  DpText,
  DpHtml,
  OgWebsite,
  JwtDpPayload,
  Advertisement,
} from "@originator-profile/model";
import { dpNamespace } from "./jwt-payload";

/**
 * DpText 型であるか否か
 * @param dpItem
 * @return DpText 型であれば true、それ以外ならば false
 */
export const isDpText = (dpItem: DpItem): dpItem is DpText =>
  dpItem.type === DpText.properties.type.const;

/**
 * DpItem が DpVisibleText 型であるか否か
 * @param dpItem
 * @return DpVisibleText 型であれば true、それ以外ならば false
 */
export const isDpVisibleText = (dpItem: DpItem): dpItem is DpVisibleText =>
  dpItem.type === DpVisibleText.properties.type.const;

/**
 * DpItem が DpHtml 型であるか否か
 * @param dpItem
 * @return DpHtml 型であれば true、それ以外ならば false
 */
export const isDpHtml = (dpItem: DpItem): dpItem is DpHtml =>
  dpItem.type === DpHtml.properties.type.const;

/**
 * DpItem が OgWebsite 型であるか否か
 * @param dpItem
 * @return OgWebsite 型であれば true、それ以外ならば false
 */
export const isOgWebsite = (dpItem: DpItem): dpItem is OgWebsite =>
  dpItem.type === OgWebsite.properties.type.const;

/**
 * DpItem が Advertisement 型であるか否か
 * @param dpItem
 * @return Advertisement 型であれば true、それ以外ならば false
 */
export const isAdvertisement = (dpItem: DpItem): dpItem is Advertisement =>
  dpItem.type === Advertisement.properties.type.const;

/**
 * DpPayload から DpVisibleText, DpHtml, DpText 型の最初の Item を返す
 * @param dpPayload
 * @return 見つかれば DpItem を返す。なければ undefined
 */
export const findFirstItemWithProof = (
  dpPayload: JwtDpPayload,
): DpVisibleText | DpText | DpHtml | undefined => {
  const types = [
    DpVisibleText.properties.type.const,
    DpText.properties.type.const,
    DpHtml.properties.type.const,
  ] as const;

  return dpPayload[dpNamespace]?.item.find(({ type }: { type: string }) =>
    types.includes(type as (typeof types)[number]),
  ) as DpVisibleText | DpText | DpHtml | undefined;
};
