import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { isOp } from "../utils/op";
import { routes } from "../utils/routes";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Template from "../templates/TechnicalInformation";

type Props = {
  nested?: boolean;
};

function TechnicalInformation(props: Props) {
  const { issuer, subject } = useParams<{ issuer: string; subject: string }>();
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
    (profile) => profile.issuer === issuer && profile.subject === subject
  );
  if (!profile) {
    return (
      <ErrorPlaceholder>
        <p>プロファイルが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  if (nested)
    return <NestedRoute profile={profile} targetOrigin={targetOrigin} />;
  return <Route profile={profile} targetOrigin={targetOrigin} />;
}

export default TechnicalInformation;
