import useProfiles from "../utils/use-profiles";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Template from "../templates/Profiles";

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
    <Template
      profiles={profiles}
      advertisers={advertisers}
      publishers={publishers}
      main={main}
    />
  );
}

export default Profiles;
