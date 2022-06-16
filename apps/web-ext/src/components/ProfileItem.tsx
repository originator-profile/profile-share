import { Profile } from "../types/profile";
import { Role } from "../types/role";
import { isOp, isHolder } from "../utils/op";
import { isWebsite } from "../utils/dp";
import { routes } from "../utils/routes";
import Item from "./Item";

type Props = {
  profile: Profile;
  variant: "main" | "sub";
  roles?: Role[];
};

function ProfileItem({ profile, variant, roles = [] }: Props) {
  if (isOp(profile)) {
    const holder = profile.item.find(isHolder);
    // TODO: 所有者が存在しない場合の見た目の実装
    if (!holder) return <div />;
    const logo = holder.logos?.find(({ isMain }) => isMain);
    return (
      <Item
        image={logo?.url}
        name={holder.name}
        to={routes.holder.build(profile)}
        variant={variant}
        roles={roles}
      />
    );
  } else {
    const website = profile.item.find(isWebsite);
    // TODO: ウェブサイトが存在しない場合の見た目
    if (!website) return <div />;
    return (
      <Item
        image={website.image}
        name={website.title}
        to={routes.website.build(profile)}
        variant={variant}
        roles={roles}
      />
    );
  }
}

export default ProfileItem;
