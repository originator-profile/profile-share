import { OriginatorProfile } from "@originator-profile/model";

export type VerifiedWebsiteMetadata = {
  originator: OriginatorProfile;
  // TODO: Certificate のモデルを実装して
  certificates: unknown[];
  // TODO: WebsiteMetadata のモデルを実装して
  assertions: unknown[];
};

export type WebsiteMetadataProps = {
  websiteMetadata: VerifiedWebsiteMetadata;
};
