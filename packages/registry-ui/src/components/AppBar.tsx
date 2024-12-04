import logoDark from "@originator-profile/ui/src/assets/logoDark.svg";
import { Image, Spinner } from "@originator-profile/ui";
import { Menu } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router";
import clsx from "clsx";
import { useSession } from "../utils/session";
import { useAccount } from "../utils/account";

function UserProfile() {
  const session = useSession();

  if (session.isLoading) return <Spinner />;

  if (session.data?.isAuthenticated) {
    return (
      <Menu as="div" className="relative">
        <Menu.Button className="jumpu-text-button flex items-center gap-2 text-white rounded-none hover:bg-gray-700">
          <img
            className="jumpu-avatar w-8 h-8"
            src={session.data.user.picture}
            alt=""
          />
          <span>{session.data.user.name}</span>
          <Icon icon="fa6-solid:caret-down" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-1 w-full jumpu-card">
          <Menu>
            <button
              className="jumpu-text-button w-full"
              type="button"
              onClick={() => session.logout()}
            >
              ログアウト
            </button>
          </Menu>
        </Menu.Items>
      </Menu>
    );
  }

  return (
    <button
      className="jumpu-text-button text-white rounded-none hover:bg-gray-700"
      type="button"
      onClick={() => session.login()}
    >
      ログイン
    </button>
  );
}

type Props = {
  className?: string;
};

export default function AppBar({ className }: Props) {
  const accountIdOrNull = useSession().data?.user?.accountId ?? null;
  const { data: account } = useAccount(accountIdOrNull);

  const link: { [key: string]: string } = {
    group: "/app/request-op/",
    certifier: "/app/review-op/",
    none: "/",
  };
  return (
    <header className={clsx("bg-black", className)}>
      <div className="max-w-5xl px-4 mx-auto flex gap-2 justify-between items-center">
        <Link to={link[account?.roleValue ?? "none"]}>
          <Image
            className="px-2"
            placeholderSrc={logoDark}
            alt="Originator Profile"
            width={140}
            height={30}
          />
        </Link>
        <UserProfile />
      </div>
    </header>
  );
}
