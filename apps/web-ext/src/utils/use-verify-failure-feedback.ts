import React from "react";
import { findProfileErrors } from "@originator-profile/ui/src/utils";
import { routes } from "./routes";
import { Profile } from "@originator-profile/ui/src/types";
import { Navigate } from "react-router-dom";
import Loading from "../components/Loading";
import Unsupported from "../components/Unsupported";

interface useVerifyFailureFeedbackProps {
  profiles?: Profile[];
  websiteProfiles?: Profile[];
  tabId: number;
  queryParams: URLSearchParams;
}

function useVerifyFailureFeedback({
  profiles,
  websiteProfiles,
  tabId,
  queryParams,
}: useVerifyFailureFeedbackProps): React.ReactNode {
  if (!profiles || !websiteProfiles) return React.createElement(Loading);
  const allProfiles = [...(profiles ?? []), ...(websiteProfiles ?? [])];

  const hasUnsafeParam = queryParams.has("unsafe");
  const errors = findProfileErrors(allProfiles);
  const hasProfileTokenVerifyFailed = errors.some(
    (result) => result.code === "ERR_PROFILE_TOKEN_VERIFY_FAILED",
  );

  if (hasProfileTokenVerifyFailed && !hasUnsafeParam) {
    const path = [
      routes.base.build({ tabId: String(tabId) }),
      routes.prohibition.build({}),
    ].join("/");
    return React.createElement(Navigate, { to: path });
  }

  if (!hasProfileTokenVerifyFailed && errors[0]) {
    return React.createElement(Unsupported, { error: errors[0] });
  }

  return null;
}

export default useVerifyFailureFeedback;
