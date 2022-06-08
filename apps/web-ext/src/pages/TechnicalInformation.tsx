import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { Profile } from "../types/profile";
import { isOp } from "../utils/op";
import { Paths } from "../types/routes";
import { routes } from "../utils/routes";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import BackHeader from "../components/BackHeader";
import TechnicalInformationTable from "../components/TechnicalInformationTable";

function Page({
  profile,
  targetOrigin,
  paths,
}: {
  profile: Profile;
  targetOrigin?: string;
  paths: Paths;
}) {
  return (
    <>
      <BackHeader className="sticky top-0" to={paths.back}>
        <h1 className="text-sm">技術情報</h1>
      </BackHeader>
      <TechnicalInformationTable
        className="w-full table-fixed"
        profile={profile}
        targetOrigin={targetOrigin}
      />
    </>
  );
}

function TechnicalInformation() {
  const params = useParams();
  const subject =
    "nestedSubject" in params ? params.nestedSubject : params.subject;
  const { profiles, error, targetOrigin } = useProfiles();
  if (error) {
    return (
      <ErrorPlaceholder>
        <p>{error.message}</p>
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
  if (!profile) {
    return (
      <ErrorPlaceholder>
        <p>プロファイルが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  const paths = {
    back:
      "nestedIssuer" in params
        ? routes.nestedHolder.toPath(params)
        : isOp(profile)
        ? routes.holder.toPath(params)
        : routes.website.toPath(params),
  } as const;
  return <Page profile={profile} targetOrigin={targetOrigin} paths={paths} />;
}

export default TechnicalInformation;
