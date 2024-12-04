import clsx from "clsx";
import { useParams, Link } from "react-router";
import { DpItemContent } from "@originator-profile/core";
import { DocumentProfile, Image } from "@originator-profile/ui";
import placeholderDpThumbnail from "@originator-profile/ui/src/assets/placeholder-dp-thumbnail.png";
import { buildPublUrl } from "../utils/routes";

type Props = {
  filteredDps: DocumentProfile[];
  handleClickDp: (dp: DocumentProfile) => () => void;
};

function DpSelector({ filteredDps, handleClickDp }: Props) {
  const { issuer, subject, ...params } = useParams<{
    issuer: string;
    subject: string;
    tabId: string;
  }>();
  const tabId = Number(params.tabId);

  return (
    <ul>
      {filteredDps.map((dp) => {
        const active = dp.is({ issuer, subject });
        const content = (dp.findOgWebsiteItem() ??
          dp.findAdvertisementItem()) as DpItemContent | undefined;
        return (
          <li key={dp.getReactKey()}>
            <Link
              className="flex justify-center items-center h-16 relative"
              to={buildPublUrl(tabId, dp)}
              onClick={handleClickDp(dp)}
            >
              <div className="inline-block">
                <Image
                  className={clsx(
                    "bg-gray-200 rounded-lg transition duration-300 ease-in-out hover:ring-2 hover:ring-gray-500 hover:ring-offset-2",
                    { ["ring-2 ring-gray-500 ring-offset-2"]: active },
                  )}
                  src={content?.image}
                  placeholderSrc={placeholderDpThumbnail}
                  alt={content?.title ?? ""}
                  width={44}
                  height={44}
                  cover
                />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default DpSelector;
