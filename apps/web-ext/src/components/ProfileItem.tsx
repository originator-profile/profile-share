import { isOp, isOpHolder, isOgWebsite } from "@webdino/profile-core";
import { Profile } from "../types/profile";
import { Role } from "../types/role";
import { routes } from "../utils/routes";
import Item from "./Item";

type Props = {
  className?: string;
  profile: Profile;
  variant: "main" | "sub";
  as?: React.ElementType;
  link?: boolean;
  roles?: Role[];
  onClickProfile?: (profile: Profile) => void;
};

function ProfileItem({
  className,
  profile,
  variant,
  as,
  link = true,
  roles = [],
  onClickProfile,
}: Props) {
  const handleClick = (profile: Profile) => () => onClickProfile?.(profile);
  if (isOp(profile)) {
    const holder = profile.item.find(isOpHolder);
    if (!holder) return null;
    const logo = holder.logos?.find(({ isMain }) => isMain);
    return (
      <Item
        className={className}
        image={logo?.url}
        name={holder.name}
        variant={variant}
        as={as}
        roles={roles}
        onClick={onClickProfile ? handleClick(profile) : undefined}
      />
    );
  } else {
    const website = profile.item.find(isOgWebsite);
    if (!website) return null;
    return (
      <Item
        className={className}
        image={website.image}
        name={website.title}
        to={link ? routes.dp.build(profile) : undefined}
        variant={variant}
        as={as}
        roles={roles}
        onClick={handleClick(profile)}
      />
    );
  }
}

export default ProfileItem;
