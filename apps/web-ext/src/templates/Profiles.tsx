import { Profile } from "../types/profile";
import { toRoles } from "../utils/role";
import { sortProfiles } from "../utils/profile";
import ProfileItem from "../components/ProfileItem";
import storage from "../utils/storage";
import browser from "webextension-polyfill";

type Props = {
  profiles: Profile[];
  advertisers: string[];
  publishers: string[];
  main: string[];
};

function Profiles({ profiles, advertisers, publishers, main }: Props) {
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
      {sortProfiles(profiles, main).map((profile, index) => {
        const roles = toRoles(profile.subject, advertisers, publishers);
        return (
          <ProfileItem
            key={`${encodeURIComponent(profile.issuer)}/${encodeURIComponent(
              profile.subject
            )}`}
            profile={profile}
            variant={index === 0 ? "main" : "sub"}
            roles={roles}
            onClickProfile={handleClickProfile}
          />
        );
      })}
    </ul>
  );
}

export default Profiles;
