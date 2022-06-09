import { Profile } from "../types/profile";
import { isOp } from "../utils/op";
import { toRoles } from "../utils/role";
import { sortProfiles } from "../utils/profile";
import OpItem from "../components/OpItem";
import DpItem from "../components/DpItem";

type Props = {
  profiles: Profile[];
  advertisers: string[];
  publishers: string[];
  main: string[];
};

function Profiles({ profiles, advertisers, publishers, main }: Props) {
  return (
    <ul>
      {sortProfiles(profiles, main).map((profile, index) => {
        const roles = toRoles(profile.subject, advertisers, publishers);
        return isOp(profile) ? (
          <OpItem
            key={profile.subject}
            op={profile}
            variant={index === 0 ? "primary" : "secondary"}
            roles={roles}
          />
        ) : (
          <DpItem key={profile.subject} dp={profile} />
        );
      })}
    </ul>
  );
}

export default Profiles;
