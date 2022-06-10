import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Template from "../templates/TechnicalInformation";

type Props = { back: string };

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

  return <Template profile={profile} paths={props} />;
}

export default TechnicalInformation;
