import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { Op } from "../types/op";
import { isOp } from "../utils/op";
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
        <h1 className="text-sm">認証機関</h1>
      </BackHeader>
      <Image
        src="/assets/logo-certifier.png"
        placeholderSrc="/assets/placeholder-logo-main.png"
        alt="第三者認証機関のロゴ"
        width={320}
        height={198}
      />
      <hr className="border-gray-50 border-4" />
      <CertifierTable className="w-full table-fixed" op={op} />
    </>
  );
}

function Certifier() {
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
  return <Page op={profile} />;
}

export default Certifier;
