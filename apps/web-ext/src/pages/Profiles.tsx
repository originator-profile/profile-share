import useProfiles from "../utils/use-profiles";
import { Profile } from "../types/profile";
import { isOp } from "../utils/op";
import { toRoles } from "../utils/role";
import { sortProfiles } from "../utils/profile";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import OpItem from "../components/OpItem";
import DpItem from "../components/DpItem";

function Page({
  profiles,
  advertisers,
  publishers,
  main,
}: {
  profiles: Profile[];
  advertisers: string[];
  publishers: string[];
  main: string[];
}) {
  return (
    <ul>
      {sortProfiles(profiles, main).map((profile, index) => {
        const roles = toRoles(profile.subject, advertisers, publishers);
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
    publishers = [],
    main = [],
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
  return (
    <Page
      profiles={profiles}
      advertisers={advertisers}
      publishers={publishers}
      main={main}
    />
  );
}

export default Profiles;
