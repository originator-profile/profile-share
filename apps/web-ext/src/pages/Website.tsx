import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { isWebsite, isDp } from "../utils/dp";
import { routes } from "../utils/routes";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Template from "../templates/Website";

function Website() {
  const { issuer, subject } = useParams<{ issuer: string; subject: string }>();
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
  const profile = profiles.find(
    (profile) => profile.issuer === issuer && profile.subject === subject
  );
  if (!profile || !isDp(profile)) {
    return (
      <ErrorPlaceholder>
        <p>プロファイルが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  const website = profile.item.find(isWebsite);
  if (!website) {
    return (
      <ErrorPlaceholder>
        <p>ウェブサイトが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }

  const op = profiles.find(({ subject }) => subject === profile.issuer);
  const paths = {
    back: routes.profiles.build({}),
    holder: op ? routes.holder.build(op) : "",
    tech: routes.tech.build({}),
  } as const;
  return <Template dp={profile} website={website} paths={paths} />;
}

export default Website;
