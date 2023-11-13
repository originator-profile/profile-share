import { Icon } from "@iconify/react";
import { Outlet, Link } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import useTabs from "../../../utils/use-tabs";

/**
 * NOTE: Jumpu UIがナビゲーションタブの実装に対応しておらずARIA APGタブパターンに逸脱した実装になっている
 * see https://github.com/tuqulore/jumpu-ui/issues/544
 */

function Tabs() {
  const { registerTabsSelected, isTabSelected } = useTabs();
  return (
    <header className="bg-gray-50 border-b">
      <div className="jumpu-tabs max-w-5xl px-4 mx-auto mb-[-1px]">
        <nav role="tablist">
          <Link
            role="tab"
            aria-selected={isTabSelected("request-op")}
            className="gap-2"
            to="./"
          >
            <Icon icon="iconamoon:home-light" />
            ホーム
          </Link>
          <Link
            role="tab"
            aria-selected={isTabSelected("notifications")}
            className="gap-2"
            to="./notifications/"
          >
            <Icon icon="bx:envelope" />
            お知らせ
          </Link>
          <Link
            role="tab"
            aria-selected={registerTabsSelected}
            className="gap-2"
            to="./holder/"
          >
            <Icon icon="fa6-solid:list-check" />
            登録
          </Link>
        </nav>
      </div>
    </header>
  );
}

function RegisterTabs() {
  const { registerTabs, registerTabsSelected, isTabSelected } = useTabs();

  if (!registerTabsSelected) return null;

  return (
    <div className="jumpu-boxed-tabs mb-6">
      <h1 className="text-4xl font-bold border-b min-w-[12rem]">登録</h1>
      <nav role="tablist" className="!justify-end">
        {registerTabs.map((registerTab) => (
          <Link
            role="tab"
            aria-selected={isTabSelected(registerTab.route)}
            className="min-w-[10rem]"
            to={`./${registerTab.route}/`}
          >
            {registerTab.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function Article() {
  return (
    <article className="max-w-5xl px-4 pt-12 pb-8 mx-auto">
      <RegisterTabs />
      <Outlet />
    </article>
  );
}

function Layout() {
  return (
    <>
      <Tabs />
      <Article />
    </>
  );
}

export default withAuthenticationRequired(Layout);
