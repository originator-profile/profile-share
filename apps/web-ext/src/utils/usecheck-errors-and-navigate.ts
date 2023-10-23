import { findProfileErrors } from "@originator-profile/ui/src/utils";
import { routes } from "./routes";
import { Profile, ProfileError } from "@originator-profile/ui/src/types";

type CheckResult =
  | { type: "navigate"; path: string }
  | { type: "error"; error: ProfileError };

function usecheckErrorsAndNavigate({
  profiles,
  tabId,
  queryParams,
}: {
  profiles: Profile[];
  tabId: number;
  queryParams: URLSearchParams;
}): CheckResult | undefined {
  const hasUnsafeParam = queryParams.has("unsafe");
  const errors = findProfileErrors(profiles);
  const hasProfileTokenVerifyFailed = errors.some(
    (result) => result.code === "ERR_PROFILE_TOKEN_VERIFY_FAILED",
  );

  if (hasProfileTokenVerifyFailed && !hasUnsafeParam) {
    const path = [
      routes.base.build({ tabId: String(tabId) }),
      routes.prohibition.build({}),
    ].join("/");
    return { type: "navigate", path };
  }

  if (!hasProfileTokenVerifyFailed && errors[0]) {
    return { type: "error", error: errors[0] };
  }

  return;
}

export default usecheckErrorsAndNavigate;
