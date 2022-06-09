import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { isHolder, isOp } from "../utils/op";
import { toRoles } from "../utils/role";
import { routes } from "../utils/routes";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Template from "../templates/Holder";

function Holder() {
  const params = useParams();
  const paths = {
    back: routes.profiles.toPath(params),
    certifier: routes.certifier.toPath(params),
    technicalInformation: routes.technicalInformation.toPath(params),
  } as const;
  const {
    advertisers = [],
    publishers = [],
    profiles,
    error,
    targetOrigin,
  } = useProfiles();
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
  const profile = profiles.find(
    (profile) => profile.subject === params.subject
  );
  if (!profile || !isOp(profile)) {
    return (
      <ErrorPlaceholder>
        <p>プロファイルが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  const holder = profile.item.find(isHolder);
  if (!holder) {
    return (
      <ErrorPlaceholder>
        <p>所有者情報が見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  const roles = toRoles(profile.subject, advertisers, publishers);
  return <Template op={profile} holder={holder} roles={roles} paths={paths} />;
}

export default Holder;
