import { Link } from "react-router-dom";
import { Profile } from "../types/profile";
import { isOp, isDp, isOpHolder } from "@webdino/profile-core";
import { sortProfiles } from "../utils/profile";
import { routes } from "../utils/routes";
import Image from "../components/Image";
import storage from "../utils/storage";
import browser from "webextension-polyfill";

type Props = {
  profiles: Profile[];
  main: string[];
};

function Publs({ profiles, main }: Props) {
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
              className="flex justify-center items-center h-20 hover:bg-blue-50"
              to={routes.publ.build(dp)}
              onClick={handleClickProfile(dp)}
            >
              <Image
                src={logo?.url}
                placeholderSrc="/assets/placeholder-logo-main.png"
                alt={`${holder?.name}のロゴ`}
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
