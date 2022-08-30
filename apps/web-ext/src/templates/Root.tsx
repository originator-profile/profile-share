import { Profile } from "../types/profile";
import { Dp } from "../types/dp";
import { toRoles } from "../utils/role";
import { sortProfiles } from "../utils/profile";
import ProfileItem from "../components/ProfileItem";
import storage from "../utils/storage";
import browser from "webextension-polyfill";

type Props = {
  dps: Dp[];
  advertisers: string[];
  publishers: string[];
  main: string[];
};

function Root({ dps, advertisers, publishers, main }: Props) {
  const handleClickProfile = (profile: Profile) => {
    const tabId = storage.getItem("tabId");
    if (!tabId) return;
    browser.tabs.sendMessage(tabId, {
      type: "focus-profile",
      profile: profile,
    });
  };
  return (
    <ul>
      {sortProfiles(dps, main).map((dp, index) => {
        const roles = toRoles(dp.subject, advertisers, publishers);
        return (
          <ProfileItem
            key={`${encodeURIComponent(dp.issuer)}/${encodeURIComponent(
              dp.subject
            )}`}
            profile={dp}
            variant={index === 0 ? "main" : "sub"}
            roles={roles}
            onClickProfile={handleClickProfile}
          />
        );
      })}
    </ul>
  );
}

export default Root;
