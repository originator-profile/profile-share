import { useParams } from "react-router-dom";
import { isOp, isOpHolder } from "@webdino/profile-core";
import useProfiles from "../utils/use-profiles";
import { toRoles } from "../utils/role";
import findProfileGenericError from "../utils/find-profile-generic-error";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import NotFound from "../components/NotFound";
import Template from "../templates/Org";
import Unsupported from "../components/Unsupported";

type Props = { back: string };

function Org(props: Props) {
  const { orgIssuer, orgSubject } = useParams<{
    orgIssuer: string;
    orgSubject: string;
  }>();
  const {
    advertisers = [],
    publishers = [],
    profiles,
    error,
    profileEndpoint,
  } = useProfiles();
  if (error) {
    return <Unsupported error={error} />;
  }
  if (!profiles) {
    return (
      <LoadingPlaceholder>
        <p>
          {profileEndpoint && `${profileEndpoint.origin} の`}
          プロファイルを取得検証しています...
        </p>
      </LoadingPlaceholder>
    );
  }
  const result = findProfileGenericError(profiles);
  // TODO: 禁止のケースの見た目を実装して
  if (result) {
    return <Unsupported error={result} />;
  }
  const op = profiles
    .filter(isOp)
    .find(
      (profile) =>
        profile.issuer === orgIssuer && profile.subject === orgSubject
    );
  if (!op) {
    return <NotFound variant="op" />;
  }
  const holder = op.item.find(isOpHolder);
  if (!holder) {
    return <NotFound variant="holder" />;
  }
  const roles = toRoles(op.subject, advertisers, publishers);
  const paths = {
    back: props.back,
  } as const;
  return (
    <Template
      paths={paths}
      op={op}
      holder={holder}
      roles={roles}
      profileEndpoint={profileEndpoint}
    />
  );
}

export default Org;
