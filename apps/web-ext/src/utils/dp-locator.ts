import { isDpText, isDpVisibleText, isDpHtml } from "@webdino/profile-core";
import { DpItem } from "@webdino/profile-model";
import { DpLocator } from "../types/dp-locator";

export const isDpLocator = (dpItem: DpItem): dpItem is DpLocator =>
  isDpVisibleText(dpItem) || isDpText(dpItem) || isDpHtml(dpItem);
