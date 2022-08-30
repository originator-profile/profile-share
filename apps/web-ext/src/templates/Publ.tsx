import { Dp, DpWebsite } from "../types/dp";
import Image from "../components/Image";
import VerifySuccessBadge from "../components/VerifySuccessBadge";
import VerifyFailureBadge from "../components/VerifyFailureBadge";
import WebsiteTable from "../components/WebsiteTable";
import Description from "../components/Description";
import NavLink from "../components/NavLink";

type Props = {
  dp: Dp;
  website: DpWebsite;
  paths: { org: string };
};

function Publ({ dp, website, paths }: Props) {
  return (
    <>
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
        {paths.org && (
          <NavLink className="mb-2" to={paths.org}>
            所有者情報
          </NavLink>
        )}
      </div>
    </>
  );
}

export default Publ;
