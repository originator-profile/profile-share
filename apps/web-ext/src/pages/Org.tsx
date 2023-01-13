import { useParams } from "react-router-dom";
import { isOp, isOpHolder } from "@webdino/profile-core";
import useProfiles from "../utils/use-profiles";
import { toRoles } from "../utils/role";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Template from "../templates/Org";
import { ProfilesFetchFailed } from "@webdino/profile-verify";
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
  if (error instanceof ProfilesFetchFailed) {
    return <Unsupported />;
  }
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
          {profileEndpoint && `${profileEndpoint.origin} の`}
          プロファイルを取得検証しています...
        </p>
      </LoadingPlaceholder>
    );
  }
  const op = profiles
    .filter(isOp)
    .find(
      (profile) =>
        profile.issuer === orgIssuer && profile.subject === orgSubject
    );
  if (!op) {
    return (
      <ErrorPlaceholder>
        <p>プロファイルが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  const holder = op.item.find(isOpHolder);
  if (!holder) {
    return (
      <ErrorPlaceholder>
        <p>所有者情報が見つかりませんでした</p>
      </ErrorPlaceholder>
    );
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
