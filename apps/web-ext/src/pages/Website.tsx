import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { isWebsite, isDp } from "../utils/dp";
import { Dp, DpWebsite } from "../types/dp";
import { Paths } from "../types/routes";
import { routes } from "../utils/routes";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Image from "../components/Image";
import BackHeader from "../components/BackHeader";
import VerifySuccessBadge from "../components/VerifySuccessBadge";
import VerifyFailureBadge from "../components/VerifyFailureBadge";
import WebsiteTable from "../components/WebsiteTable";
import Description from "../components/Description";
import NavLink from "../components/NavLink";

function Page({
  dp,
  website,
  paths,
}: {
  dp: Dp;
  website: DpWebsite;
  paths: Paths;
}) {
  return (
    <>
      <BackHeader className="sticky top-0" to={paths.back}>
        <h1 className="text-sm">ウェブサイト情報</h1>
      </BackHeader>
      <Image
        src={website.image}
        placeholderSrc="/assets/placeholder-logo-main.png"
        alt={`${website.name}のロゴ`}
        width={320}
        height={198}
      />
      <div className="px-3 py-3">
        {dp.error instanceof Error ? (
          <VerifyFailureBadge />
        ) : (
          <VerifySuccessBadge />
        )}
      </div>
      <hr className="border-gray-50 border-4" />
      <WebsiteTable className="w-full table-fixed" website={website} />
      {website.description && <Description description={website.description} />}
      <div className="px-3 pt-2 pb-20 bg-gray-50">
        {paths.holder && (
          <NavLink className="mb-2" to={paths.holder}>
            所有者情報
          </NavLink>
        )}
        <NavLink to={paths.technicalInformation}>技術情報</NavLink>
      </div>
    </>
  );
}

function Website() {
  const params = useParams();
  const subject =
    "nestedSubject" in params ? params.nestedSubject : params.subject;
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
  const profile = profiles.find((profile) => profile.subject === subject);
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
  const nestedProfile = profiles.find(
    ({ subject }) => subject === profile.issuer
  );
  const paths = {
    back: routes.profiles.toPath(params),
    holder:
      (nestedProfile &&
        routes.nestedHolder.toPath({
          ...params,
          nestedIssuer: nestedProfile.issuer,
          nestedSubject: nestedProfile.subject,
        })) ||
      "",
    technicalInformation: routes.technicalInformation.toPath(params),
  } as const;
  return <Page dp={profile} website={website} paths={paths} />;
}

export default Website;
