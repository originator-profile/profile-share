import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import useOps from "../utils/use-ops";
import { Op } from "../types/op";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";

function Page({ op, targetOrigin }: { op: Op; targetOrigin?: string }) {
  return (
    <>
      <h1>技術情報</h1>
      <ul>
        <li>
          <Link to="/holder">保有者の詳細</Link>
        </li>
      </ul>
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
