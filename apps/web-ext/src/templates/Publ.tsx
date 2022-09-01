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
    <div className="bg-gray-50 min-h-screen">
      <Image
        src={website.image}
        placeholderSrc="/assets/placeholder-logo-main.png"
        alt={`${website.name}のロゴ`}
        width={320}
        height={198}
      />
      <div className="px-3 py-3 bg-white">
        {dp.error instanceof Error ? (
          <VerifyFailureBadge />
        ) : (
          <VerifySuccessBadge />
        )}
      </div>
      <hr className="border-gray-50 border-4" />
      <WebsiteTable className="w-full table-fixed bg-white" website={website} />
      {website.description && <Description description={website.description} />}
      <div className="px-3 pt-2">
        {paths.org && (
          <NavLink className="mb-2" to={paths.org}>
            所有者情報
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default Publ;
