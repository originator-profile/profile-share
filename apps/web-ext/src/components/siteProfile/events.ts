import { defineExtensionMessaging } from "@webext-core/messaging";
import { FetchSiteProfileMessageResult } from "./types";

type SiteProfileProtocolMap = {
  fetchSiteProfile(message: null): FetchSiteProfileMessageResult;
};

export const siteProfileMessenger =
  defineExtensionMessaging<SiteProfileProtocolMap>();
