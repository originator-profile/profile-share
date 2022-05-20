import { useParams } from "react-router-dom";
import useOps from "../utils/use-ops";
import { Op } from "../types/op";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Image from "../components/Image";
import BackHeader from "../components/BackHeader";
import CertifierTable from "../components/CertifierTable";

function Page({ op }: { op: Op }) {
  return (
    <>
      <BackHeader
        className="sticky top-0"
        to={`/${encodeURIComponent(op.subject)}/holder`}
      >
        <h1 className="text-base">認証機関</h1>
      </BackHeader>
      <Image
        src="/assets/logo-jicdaq.png"
        placeholderSrc="/assets/placeholder-logo-main.png"
        alt="一般社団法人 デジタル広告品質認証機構のロゴ"
        width={320}
        height={198}
      />
      <hr className="border-gray-50 border-4" />
      <CertifierTable className="w-full" op={op} />
    </>
  );
}

function Certifier() {
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
  return <Page op={op} />;
}

export default Certifier;
