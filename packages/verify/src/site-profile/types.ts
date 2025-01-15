import { SiteProfile, WebsiteProfile } from "@originator-profile/model";
import {
  OpsVerificationResult,
  VerifiedOps,
} from "../originator-profile-set/types";
import {
  SiteProfileFetchFailed,
  SiteProfileFetchInvalid,
} from "./fetch-errors";
import { SiteProfileInvalid, SiteProfileVerifyFailed } from "./verify-errors";
import {
  JwtVcDecodingResult,
  JwtVcVerificationResult,
  VerifiedJwtVc,
} from "@originator-profile/securing-mechanism";
import { CoreProfileNotFound } from "../originator-profile-set/errors";

export type FetchSiteProfileResult =
  | {
      ok: true;
      result: SiteProfile;
      origin: URL["origin"];
    }
  | SiteProfileFetchFailed
  | SiteProfileFetchInvalid;

/** Site Profile 検証失敗 */
export type SpVerificationFailure = {
  originators: OpsVerificationResult;
  credential?:
    | JwtVcVerificationResult<WebsiteProfile>
    | JwtVcDecodingResult<WebsiteProfile>
    | CoreProfileNotFound<WebsiteProfile>;
};

export type VerifiedSp = {
  originators: VerifiedOps;
  credential: VerifiedJwtVc<WebsiteProfile>;
};

export type SpVerificationResult =
  | VerifiedSp
  | SiteProfileInvalid
  | SiteProfileVerifyFailed;
