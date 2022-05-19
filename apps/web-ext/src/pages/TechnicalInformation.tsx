import { useParams } from "react-router-dom";
import useOps from "../utils/use-ops";
import { Op } from "../types/op";
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
  const { ops, error, targetOrigin } = useOps();
  if (error) {
    return (
      <ErrorPlaceholder>
        <p>{error.message}</p>
      </ErrorPlaceholder>
    );
  }
  if (!ops) {
    return (
      <LoadingPlaceholder>
        <p>
          {targetOrigin && `${targetOrigin} の`}
          プロファイルを取得検証しています...
        </p>
      </LoadingPlaceholder>
    );
  }
  const op = ops.find((op) => op.subject === subject);
  if (!op) {
    return (
      <ErrorPlaceholder>
        <p>プロファイルが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  return <Page op={op} targetOrigin={targetOrigin} />;
}

export default TechnicalInformation;
