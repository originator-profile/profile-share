import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { isOp } from "../utils/op";
import { routes } from "../utils/routes";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Template from "../templates/TechnicalInformation";

function NestedTechnicalInformation() {
  const params = useParams();
  const { profiles, error, targetOrigin } = useProfiles();
  if (error) {
    return (
      <ErrorPlaceholder>
        <p>{error.message}</p>
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
  const profile = profiles.find(
    (profile) => profile.subject === params.nestedSubject
  );
  if (!profile) {
    return (
      <ErrorPlaceholder>
        <p>プロファイルが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  const paths = {
    back: isOp(profile)
      ? routes.holder.toPath(params)
      : routes.website.toPath(params),
  } as const;
  return (
    <Template profile={profile} targetOrigin={targetOrigin} paths={paths} />
  );
}

export default NestedTechnicalInformation;
