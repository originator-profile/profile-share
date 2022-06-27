import { useParams } from "react-router-dom";
import { isOp, isOpHolder } from "@webdino/profile-core";
import useProfiles from "../utils/use-profiles";
import { toRoles } from "../utils/role";
import { routes } from "../utils/routes";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Template from "../templates/Holder";

type Props = { back: string };

function Holder(props: Props) {
  const { subject } = useParams();
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
  const profile = profiles.find((profile) => profile.subject === subject);
  if (!profile || !isOp(profile)) {
    return (
      <ErrorPlaceholder>
        <p>プロファイルが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  const holder = profile.item.find(isOpHolder);
  if (!holder) {
    return (
      <ErrorPlaceholder>
        <p>所有者情報が見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  const roles = toRoles(profile.subject, advertisers, publishers);
  const paths = {
    back: props.back,
    certifier: routes.certifier.build({}),
    tech: routes.tech.build({}),
  } as const;
  return <Template paths={paths} op={profile} holder={holder} roles={roles} />;
}

export default Holder;
