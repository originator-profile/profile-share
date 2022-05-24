import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { Op } from "../types/op";
import { isOp } from "../utils/op";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import BackHeader from "../components/BackHeader";
import TechnicalInformationTable from "../components/TechnicalInformationTable";

function Page({ op, targetOrigin }: { op: Op; targetOrigin?: string }) {
  return (
    <>
      <BackHeader
        className="sticky top-0"
        to={`/${encodeURIComponent(op.subject)}/holder`}
      >
        <h1 className="text-base">技術情報</h1>
      </BackHeader>
      <TechnicalInformationTable
        className="w-full"
        op={op}
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
  if (!profile || !isOp(profile)) {
    return (
      <ErrorPlaceholder>
        <p>プロファイルが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  return <Page op={profile} targetOrigin={targetOrigin} />;
}

export default TechnicalInformation;
