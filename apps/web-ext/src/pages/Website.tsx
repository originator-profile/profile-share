import { useParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { isWebsite, isDp } from "../utils/dp";
import { Dp, DpWebsite } from "../types/dp";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Image from "../components/Image";
import BackHeader from "../components/BackHeader";
import VerifySuccessBadge from "../components/VerifySuccessBadge";
import VerifyFailureBadge from "../components/VerifyFailureBadge";
import WebsiteTable from "../components/WebsiteTable";
import NavLink from "../components/NavLink";

function Page({ dp, website }: { dp: Dp; website: DpWebsite }) {
  return (
    <>
      <BackHeader className="sticky top-0" to="/">
        <h1 className="text-base">ウェブサイト情報</h1>
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
      {website.description && (
        <section className="px-3 py-2 border-gray-200 border-b">
          <h2 className="mb-1 text-gray-500 font-normal">説明</h2>
          <div
            css={{ overflowWrap: "break-word" }}
            className="prose prose-sm"
            dangerouslySetInnerHTML={{
              __html: website.description,
            }}
          />
        </section>
      )}
      <div className="px-3 pt-2 pb-20 bg-gray-50">
        <NavLink
          className="mb-2"
          to={`/${encodeURIComponent(dp.issuer)}/holder`}
        >
          所有者情報
        </NavLink>
        <NavLink
          to={`/${encodeURIComponent(dp.subject)}/technical-information`}
        >
          技術情報
        </NavLink>
      </div>
    </>
  );
}

function Website() {
  const { subject } = useParams();
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
  return <Page dp={profile} website={website} />;
}

export default Website;
