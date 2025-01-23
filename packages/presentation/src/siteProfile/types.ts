import { SiteProfile } from "@originator-profile/model";
import { SiteProfileFetchFailed, SiteProfileFetchInvalid } from "./errors";

export type FetchSiteProfileResult =
  | {
      ok: true;
      result: SiteProfile;
      origin: URL["origin"];
    }
  | SiteProfileFetchFailed
  | SiteProfileFetchInvalid;
