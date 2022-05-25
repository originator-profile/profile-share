import clsx from "clsx";
import { Icon } from "@iconify/react";

type Props = {
  className?: string;
};

function VerifySuccessBadge({ className }: Props) {
  return (
    <p
      className={clsx("text-[#00A93E] font-bold flex items-center", className)}
    >
      <Icon className="mr-1 text-base" icon="akar-icons:circle-check-fill" />
      検証済み
    </p>
  );
}

export default VerifySuccessBadge;
