import { Icon } from "@iconify/react";
import { Op } from "@webdino/profile-model";
import { isHolder } from "../utils/op";
import { Link } from "react-router-dom";

type Props = {
  op: Op;
  variant: "primary" | "secondary";
  onClick?: () => void;
  onClickDetail?: () => void;
};

function ProfileItem({ op }: Props): React.ReactElement {
  const holder = op.item.find(isHolder);
  if (!holder) return <div />;
  const logo = holder.logo?.find(({ isMain }) => isMain);
  return (
    <div className="border-gray-300 border-b">
      <img
        src={logo?.url ?? "/assets/placeholder-logo-main.png"}
        alt={`${holder.name}のロゴ`}
      />
      <div className="px-3 pb-4">
        <p>{holder.name}</p>
        <p className="jumpu-tag bg-gray-100">コンテンツを出版しています</p>
        <Link
          className="jumpu-icon-button"
          to={`/holder/${encodeURIComponent(op.subject)}`}
        >
          <Icon className="text-gray-300" icon="fa6-solid:chevron-right" />
        </Link>
      </div>
    </div>
  );
}

export default ProfileItem;
