import { Navigate } from "react-router-dom";
import { isDp } from "@webdino/profile-core";
import { sortProfiles } from "../utils/profile";
import { routes } from "../utils/routes";
import useProfiles from "../utils/use-profiles";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";

function Base() {
  const { tabId, main = [], profiles, error, targetOrigin } = useProfiles();
  if (error) {
    return (
      <ErrorPlaceholder>
        <p className="whitespace-pre-wrap">{error.message}</p>
      </ErrorPlaceholder>
    );
  }
  if (!profiles) {
    return (
      <LoadingPlaceholder>
        <p>
          {targetOrigin && `${targetOrigin} の`}
          プロファイルを取得検証しています...
        </p>
      </LoadingPlaceholder>
    );
  }
  const [dp] = sortProfiles(profiles.filter(isDp), main);
  if (!dp) {
    return (
      <ErrorPlaceholder>
        <p>プロファイルが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  return (
    <Navigate
      to={[
        routes.base.build({ tabId: String(tabId) }),
        routes.publ.build(dp),
      ].join("/")}
    />
  );
}

export default Base;
