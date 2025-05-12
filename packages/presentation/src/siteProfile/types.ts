import { SiteProfile } from "@originator-profile/model";
import { SiteProfileFetchFailed, SiteProfileFetchInvalid } from "./errors";

export type FetchSiteProfileSuccess = {
  result: SiteProfile;
  origin: URL["origin"];
};

export type FetchSiteProfileResult =
  | FetchSiteProfileSuccess
  | SiteProfileFetchFailed
  | SiteProfileFetchInvalid;
