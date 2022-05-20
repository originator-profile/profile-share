import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "./Header";

type Props = Parameters<typeof Link>[0];

function BackHeader({ className, children, ...props }: Props) {
  return (
    <Header className={className}>
      <Link
        {...props}
        css={{
          "[role='tooltip']": {
            transform: "translateX(-50%) translateY(150%) scale(0)",
          },
          "&:hover": {
            "[role='tooltip']": {
              transform: "translateX(-50%) translateY(150%) scale(1)",
            },
          },
        }}
        className="jumpu-icon-button flex-shrink-0"
        aria-describedby="tooltip-back"
      >
        <Icon className="text-lg text-gray-700" icon="fa6-solid:chevron-left" />
        <span id="tooltip-back" role="tooltip">
          戻る
        </span>
      </Link>
      {children}
    </Header>
  );
}

export default BackHeader;
