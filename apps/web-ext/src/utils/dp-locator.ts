import { isDpText, isDpVisibleText, isDpHtml } from "@webdino/profile-core";
import { DpItem } from "@webdino/profile-model";
import { DpLocator } from "../types/profile";

export const isDpLocator = (dpItem: DpItem): dpItem is DpLocator =>
  isDpVisibleText(dpItem) || isDpText(dpItem) || isDpHtml(dpItem);
