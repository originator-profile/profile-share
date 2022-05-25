import useProfiles from "../utils/use-profiles";
import { Profile } from "../types/profile";
import { isOp } from "../utils/op";
import { toRoles } from "../utils/role";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import OpItem from "../components/OpItem";
import DpItem from "../components/DpItem";

function Page({
  profiles,
  advertisers,
  mains,
}: {
  profiles: Profile[];
  advertisers: string[];
  mains: string[];
}) {
  return (
    <ul>
      {profiles.map((profile, index) => {
        const roles = toRoles(profile.subject, advertisers, mains);
        return isOp(profile) ? (
          <OpItem
            key={profile.subject}
            op={profile}
            variant={index === 0 ? "primary" : "secondary"}
            roles={roles}
          />
        ) : (
          <DpItem key={profile.subject} dp={profile} />
        );
      })}
    </ul>
  );
}

function Profiles() {
  const {
    advertisers = [],
    mains = [],
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
  return <Page profiles={profiles} advertisers={advertisers} mains={mains} />;
}

export default Profiles;
