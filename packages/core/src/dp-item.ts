import {
  DpItem,
  DpVisibleText,
  DpText,
  DpHtml,
  OgWebsite,
} from "@webdino/profile-model";

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
