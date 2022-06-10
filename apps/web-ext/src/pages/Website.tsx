import { useParams } from "react-router-dom";
import { Profile } from "../types/profile";
import useProfiles from "../utils/use-profiles";
import { isWebsite, isDp } from "../utils/dp";
import { routes } from "../utils/routes";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Template from "../templates/Website";

type RouteProps = Omit<Parameters<typeof Template>[0], "paths"> & {
  profiles: Profile[];
};

function Route({ profiles, ...props }: RouteProps) {
  const profile = profiles.find(
    (profile) => profile.subject === props.dp.issuer
  );
  const paths = {
    back: routes.profiles.build({}),
    holder: profile
      ? routes.nestedHolder.build({
          nestedIssuer: props.dp.issuer,
          nestedSubject: props.dp.subject,
          issuer: profile.issuer,
          subject: profile.subject,
        })
      : "",
    technicalInformation: routes.technicalInformation.build(props.dp),
  } as const;
  return <Template {...props} paths={paths} />;
}

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
  return <Route dp={profile} website={website} profiles={profiles} />;
}

export default Website;
