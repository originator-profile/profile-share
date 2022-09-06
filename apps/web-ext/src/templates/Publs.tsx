import clsx from "clsx";
import { useParams, Link } from "react-router-dom";
import { Profile } from "../types/profile";
import { isOp, isDp, isOpHolder } from "@webdino/profile-core";
import { sortProfiles } from "../utils/profile";
import { routes } from "../utils/routes";
import Image from "../components/Image";
import storage from "../utils/storage";
import browser from "webextension-polyfill";
import placeholderLogoMainUrl from "../assets/placeholder-logo-main.png";

type Props = {
  profiles: Profile[];
  main: string[];
};

function Publs({ profiles, main }: Props) {
  const { issuer, subject } = useParams<{ issuer: string; subject: string }>();
  const handleClickProfile = (profile: Profile) => () => {
    const tabId = storage.getItem("tabId");
    if (!tabId) return;
    browser.tabs.sendMessage(tabId, {
      type: "focus-profile",
      profile: profile,
    });
  };
  return (
    <ul>
      {sortProfiles(profiles.filter(isDp), main).map((dp) => {
        const active = dp.issuer === issuer && dp.subject === subject;
        const op = profiles
          .filter(isOp)
          .find(({ subject }) => subject === dp.issuer);
        const holder = op?.item.find(isOpHolder);
        const logo = holder?.logos?.find(({ isMain }) => isMain);
        return (
          <li
            key={`${encodeURIComponent(dp.issuer)}/${encodeURIComponent(
              dp.subject
            )}`}
          >
            <Link
              className={clsx(
                "flex justify-center items-center h-20 hover:bg-blue-50 relative",
                { ["bg-blue-50"]: active }
              )}
              to={routes.publ.build(dp)}
              onClick={handleClickProfile(dp)}
            >
              {active && (
                <svg
                  viewBox="0 0 10 10"
                  width="10"
                  height="10"
                  className="absolute left-0 -translate-x-1/2 fill-blue-500 stroke-transparent"
                >
                  <circle cx="5" cy="5" r="5" />
                </svg>
              )}
              <Image
                src={logo?.url}
                placeholderSrc={placeholderLogoMainUrl}
                alt={holder?.name ?? ""}
                width={54}
                height={54}
                rounded
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default Publs;
