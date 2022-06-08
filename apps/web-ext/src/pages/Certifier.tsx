import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { Op } from "../types/op";
import { isOp } from "../utils/op";
import { Paths } from "../types/routes";
import { routes } from "../utils/routes";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Image from "../components/Image";
import BackHeader from "../components/BackHeader";
import CertifierTable from "../components/CertifierTable";

function Page({ op, paths }: { op: Op; paths: Paths }) {
  return (
    <>
      <BackHeader className="sticky top-0" to={paths.back}>
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
  const params = useParams();
  const paths = {
    back:
      "nestedIssuer" in params
        ? routes.nestedHolder.toPath(params)
        : routes.holder.toPath(params),
  } as const;
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
  if (!profile || !isOp(profile)) {
    return (
      <ErrorPlaceholder>
        <p>プロファイルが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  return <Page op={profile} paths={paths} />;
}

export default Certifier;
