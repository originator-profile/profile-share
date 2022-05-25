import clsx from "clsx";
import { Icon } from "@iconify/react";

type Props = {
  className?: string;
};

function VerifyFailureBadge({ className }: Props) {
  return (
    <p
      className={clsx("text-yellow-600 font-bold flex items-center", className)}
    >
      <Icon className="mr-1 text-base" icon="bx:help-circle" />
      未検証
    </p>
  );
}

export default VerifyFailureBadge;
