import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Header } from "@webdino/profile-ui";

type Props = Parameters<typeof Link>[0];

function BackHeader({ className, children, ...props }: Props) {
  return (
    <Header className={className}>
      <Link
        {...props}
        className="jumpu-icon-button flex-shrink-0 group"
        aria-describedby="tooltip-back"
      >
        <Icon className="text-lg text-gray-700" icon="fa6-solid:chevron-left" />
        <span
          id="tooltip-back"
          role="tooltip"
          className="![transform:translate(-50%,_150%)_scale(0)] group-hover:![transform:translate(-50%,_150%)_scale(1)]"
        >
          戻る
        </span>
      </Link>
      {children}
    </Header>
  );
}

export default BackHeader;
