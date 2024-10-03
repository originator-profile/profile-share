import { twMerge } from "tailwind-merge";
import { Role } from "../types/role";
import { _ } from "../utils";

type Props = {
  className?: string;
  roles: Role[];
};

function Roles({ className, roles }: Props) {
  const roleName = {
    advertiser: _("Roles_AdPlacement"),
    publisher: _("Roles_ContentsPublishing"),
  } as const;

  return (
    <ul className={className}>
      {roles.map((role, index) => (
        <li
          key={index}
          className={twMerge(
            "jumpu-tag text-xs bg-gray-100",
            index < roles.length - 1 && "mb-1",
          )}
        >
          {roleName[role]}
        </li>
      ))}
    </ul>
  );
}

export default Roles;
