import { SiteProfile } from "@originator-profile/model";
import { SiteProfileFetchFailed, SiteProfileInvalid } from "./errors";

export type FetchSiteProfileResult =
  | {
      ok: true;
      result: SiteProfile;
    }
  | SiteProfileFetchFailed
  | SiteProfileInvalid;
