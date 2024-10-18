import {
  CoreProfile,
  WebMediaProfile,
  WebsiteProfile,
} from "@originator-profile/model";

export type VerifiedSiteProfile = {
  originators: {
    core: CoreProfile;
    annotations: unknown[];
    media?: WebMediaProfile;
  }[];
  credential: WebsiteProfile;
};

export type SiteProfileProps = {
  siteProfile: VerifiedSiteProfile;
};
