import React from "react";
import { ProfileSet } from "@originator-profile/ui";
import { routes } from "./routes";
import { Navigate } from "react-router-dom";
import Loading from "../components/Loading";
import Unsupported from "../components/Unsupported";

interface useVerifyFailureFeedbackProps {
  profiles: ProfileSet;
  tabId: number;
  queryParams: URLSearchParams;
}

function useVerifyFailureFeedback({
  profiles,
  tabId,
  queryParams,
}: useVerifyFailureFeedbackProps): React.ReactNode {
  if (profiles.isLoading) return React.createElement(Loading);

  const hasUnsafeParam = queryParams.has("unsafe");
  const errors = profiles.listProfileErrors();
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
