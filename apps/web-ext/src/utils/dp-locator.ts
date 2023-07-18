import { isDpText, isDpVisibleText, isDpHtml } from "@originator-profile/core";
import { DpItem } from "@originator-profile/model";
import { DpLocator } from "../types/dp-locator";

export const isDpLocator = (dpItem: DpItem): dpItem is DpLocator =>
  isDpVisibleText(dpItem) || isDpText(dpItem) || isDpHtml(dpItem);
