import clsx from "clsx";
import { ReactNode } from "react";

export type ExternalLinkProps = {
  className?: string;
  href?: string;
  children: ReactNode;
};

export function ExternalLink(props: ExternalLinkProps) {
  return (
    <a
      {...props}
      className={clsx("text-blue-600 hover:underline", props.className)}
      target="_blank"
      rel="noreferrer"
    >
      {props.children}
    </a>
  );
}
