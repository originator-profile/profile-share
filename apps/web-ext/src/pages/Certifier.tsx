import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { isOp } from "../utils/op";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Template from "../templates/Certifier";

type Props = { back: string };

function Certifier(props: Props) {
  const { subject } = useParams();
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
  const profile = profiles.find((profile) => profile.subject === subject);
  if (!profile || !isOp(profile)) {
    return (
      <ErrorPlaceholder>
        <p>プロファイルが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  return <Template op={profile} paths={props} />;
}

export default Certifier;
