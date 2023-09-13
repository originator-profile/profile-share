import { useAuth0 } from "@auth0/auth0-react";
import logoDark from "@originator-profile/ui/src/assets/logoDark.svg";
import { Image } from "@originator-profile/ui";
import { Menu } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { useUserUpsert } from "../utils/user";
import { useAccount } from "../utils/account";

function UserProfile() {
  const { loginWithRedirect, logout, isLoading, isAuthenticated, user } =
    useAuth0();
  if (isLoading) {
    return (
      <div className="jumpu-spinner">
        <svg viewBox="25 25 50 50">
          <circle cx="50" cy="50" r="20" />
        </svg>
      </div>
    );
  }
  if (isAuthenticated && user) {
    return (
      <Menu as="div" className="relative">
        <Menu.Button className="jumpu-text-button flex items-center gap-2 text-white rounded-none hover:bg-gray-700">
          <img className="jumpu-avatar w-8 h-8" src={user.picture} alt="" />
          <span>{user.name}</span>
          <Icon icon="fa6-solid:caret-down" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-1 w-full jumpu-card">
          <Menu>
            <button
              className="jumpu-text-button w-full"
              type="button"
              onClick={() =>
                logout({
                  logoutParams: {
                    returnTo: new URL(window.location.origin).href,
                  },
                })
              }
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
      onClick={() => loginWithRedirect()}
    >
      ログイン
    </button>
  );
}

type Props = {
  className?: string;
};

export default function AppBar({ className }: Props) {
  const { data: account } = useAccount(user?.accountId ?? null);

  const link: { [key: string]: string } = {
    group: "/app/request-op/",
    certifier: "/app/review-op/",
    none: "/",
  };
  return (
    <header
      className={clsx(
        "flex gap-2 justify-between items-center bg-black",
        className,
      )}
    >
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
    </header>
  );
}
