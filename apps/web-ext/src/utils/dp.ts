import { Profile } from "../types/profile";
import {
  Dp,
  DpItem,
  DpWebsite,
  DpText,
  DpVisibleText,
  DpHtml,
} from "../types/dp";

const dpItemTypes: DpItem["type"][] = [
  "website",
  "text",
  "visibleText",
  "html",
];

export const isDp = (profile: Profile): profile is Dp =>
  profile.item.some((item) =>
    dpItemTypes.includes(item.type as DpItem["type"])
  );
export const isWebsite = (dpItem: DpItem): dpItem is DpWebsite =>
  dpItem.type === "website";
export const isText = (dpItem: DpItem): dpItem is DpText =>
  dpItem.type === "text";
export const isVisibleText = (dpItem: DpItem): dpItem is DpVisibleText =>
  dpItem.type === "visibleText";
export const isHtml = (dpItem: DpItem): dpItem is DpHtml =>
  dpItem.type === "html";
