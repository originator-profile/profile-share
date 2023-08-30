import clsx from "clsx";
import { Role } from "../types/role";

type Props = {
  className?: string;
  roles: Role[];
};

const roleName = {
  advertiser: "広告の出稿",
  publisher: "コンテンツの出版",
} as const;

function Roles({ className, roles }: Props) {
  return (
    <ul className={className}>
      {roles.map((role, index) => (
        <li
          key={index}
          className={clsx(
            "jumpu-tag text-xs bg-gray-100",
            { ["mb-1"]: index < roles.length - 1 },
          )}
        >
          {roleName[role]}
        </li>
      ))}
    </ul>
  );
}

export default Roles;
