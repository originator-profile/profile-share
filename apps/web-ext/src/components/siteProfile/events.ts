import { defineExtensionMessaging } from "@webext-core/messaging";
import { FetchSiteProfileResult } from "@originator-profile/verify";

type SiteProfileProtocolMap = {
  fetchSiteProfile(message: null): FetchSiteProfileResult;
};

export const siteProfileMessenger =
  defineExtensionMessaging<SiteProfileProtocolMap>();
