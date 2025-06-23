import logoDark from "@originator-profile/ui/src/assets/logoDark.svg";
import { Image } from "@originator-profile/ui";
import clsx from "clsx";

type Props = {
  className?: string;
};

export default function AppBar({ className }: Props) {
  return (
    <header className={clsx("bg-black", className)}>
      <div className="max-w-3xl px-2 py-1.5 mx-auto flex gap-2 justify-between items-center">
        <a
          href="https://originator-profile.org/"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            className="px-2"
            placeholderSrc={logoDark}
            alt="Originator Profile"
            width={140}
            height={30}
          />
        </a>
      </div>
    </header>
  );
}
