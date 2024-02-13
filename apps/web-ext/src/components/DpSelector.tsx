import clsx from "clsx";
import { useParams, Link } from "react-router-dom";
import { isAdvertisement, isOgWebsite } from "@originator-profile/core";
import { Image } from "@originator-profile/ui";
import { Dp } from "@originator-profile/ui/src/types";
import placeholderDpThumbnail from "@originator-profile/ui/src/assets/placeholder-dp-thumbnail.png";
import { routes } from "../utils/routes";
import { Advertisement, OgWebsite } from "@originator-profile/model";

type Props = {
  filteredDps: Dp[];
};

function DpSelector({ filteredDps }: Props) {
  const { issuer, subject, ...params } = useParams<{
    issuer: string;
    subject: string;
    tabId: string;
  }>();
  const tabId = Number(params.tabId);
  const handleClickDp = (dp: Dp) => async () => {
    await chrome.tabs.sendMessage(tabId, {
      type: "overlay-profiles",
      profiles: filteredDps,
      activeDp: dp,
    });
  };

  return (
    <ul>
      {filteredDps.map((dp) => {
        const active = dp.issuer === issuer && dp.subject === subject;
        const content = dp.item.find(
          (i) => isAdvertisement(i) || isOgWebsite(i),
        ) as OgWebsite | Advertisement | undefined;
        return (
          <li
            key={`${encodeURIComponent(dp.issuer)}/${encodeURIComponent(
              dp.subject,
            )}`}
          >
            <Link
              className="flex justify-center items-center h-16 relative"
              to={[
                routes.base.build({ tabId: String(tabId) }),
                routes.publ.build(dp),
              ].join("/")}
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
