import { SingleWebAssertionSet } from "@originator-profile/model";
import { WebsiteMetadataFetchFailed, WebsiteMetadataInvalid } from "./errors";

export type FetchWebsiteMetadataResult =
  | {
      ok: true;
      result: SingleWebAssertionSet;
    }
  | WebsiteMetadataFetchFailed
  | WebsiteMetadataInvalid;
