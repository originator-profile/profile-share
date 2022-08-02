import { isDp } from "@webdino/profile-core";
import useProfiles from "../utils/use-profiles";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Template from "../templates/Root";

function Root() {
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
  const dps = profiles.filter(isDp);
  return (
    <Template
      dps={dps}
      advertisers={advertisers}
      publishers={publishers}
      main={main}
    />
  );
}

export default Root;
