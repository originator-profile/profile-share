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
  JwtVcVerificationResult,
  JwtVcVerificationResultPayload,
} from "@originator-profile/jwt-securing-mechanism";
import { CoreProfileNotFound } from "../originator-profile-set/errors";

export type FetchSiteProfileResult =
  | {
      ok: true;
      result: SiteProfile;
    }
  | SiteProfileFetchFailed
  | SiteProfileFetchInvalid;

/** Site Profile 検証失敗 */
export type SpVerificationFailure = {
  originators: OpsVerificationResult;
  credential?:
    | JwtVcVerificationResult<WebsiteProfile>
    | CoreProfileNotFound<WebsiteProfile>;
};

export type VerifiedSp = {
  originators: VerifiedOps;
  credential: JwtVcVerificationResultPayload<WebsiteProfile>;
};

export type SpVerificationResult =
  | VerifiedSp
  | SiteProfileInvalid
  | SiteProfileVerifyFailed;
