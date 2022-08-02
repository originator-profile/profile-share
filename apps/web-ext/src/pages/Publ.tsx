import { useParams } from "react-router-dom";
import { isDp, isOgWebsite } from "@webdino/profile-core";
import useProfiles from "../utils/use-profiles";
import { routes } from "../utils/routes";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Template from "../templates/Publ";

function Publ() {
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
  const website = profile.item.find(isOgWebsite);
  if (!website) {
    return (
      <ErrorPlaceholder>
        <p>ウェブサイトが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }

  const op = profiles.find(({ subject }) => subject === profile.issuer);
  const paths = {
    back: routes.root.build({}),
    org: op ? routes.org.build(op) : "",
  } as const;
  return <Template dp={profile} website={website} paths={paths} />;
}

export default Publ;
