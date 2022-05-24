import useProfiles from "../utils/use-profiles";
import { Profile } from "../types/profile";
import { isOp } from "../utils/op";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import OpItem from "../components/OpItem";

function Page({ profiles }: { profiles: Profile[] }) {
  return (
    <ul>
      {profiles.map((profile, index) =>
        isOp(profile) ? (
          <OpItem
            key={profile.subject}
            op={profile}
            variant={index === 0 ? "primary" : "secondary"}
          />
        ) : (
          // TODO: DpItem の実装
          <li key={profile.subject}>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </li>
        )
      )}
    </ul>
  );
}

function Profiles() {
  const { profiles, error, targetOrigin } = useProfiles();
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
  return <Page profiles={profiles} />;
}

export default Profiles;
