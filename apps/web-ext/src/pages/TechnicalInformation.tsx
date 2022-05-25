import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { Profile } from "../types/profile";
import { isOp } from "../utils/op";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import BackHeader from "../components/BackHeader";
import TechnicalInformationTable from "../components/TechnicalInformationTable";

function Page({
  profile,
  targetOrigin,
}: {
  profile: Profile;
  targetOrigin?: string;
}) {
  return (
    <>
      <BackHeader
        className="sticky top-0"
        to={`/${encodeURIComponent(profile.subject)}/${
          isOp(profile) ? "holder" : "website"
        }`}
      >
        <h1 className="text-base">技術情報</h1>
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
  const { subject } = useParams();
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
  return <Page profile={profile} targetOrigin={targetOrigin} />;
}

export default TechnicalInformation;
