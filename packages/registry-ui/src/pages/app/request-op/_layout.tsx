import { Outlet, useLocation, Link } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  const location = useLocation();
  const registerTabs = [
    {
      route: "holder",
      label: "組織情報",
      status: null,
    },
    {
      route: "public-key",
      label: "公開鍵",
      status: null,
    },
    {
      route: "logo",
      label: "ロゴマーク",
      status: null,
    },
    {
      route: "credential",
      label: "資格情報",
      status: null,
    },
  ] as const;

  // URLのパスを見て、どのタブが選択されているかを判定する
  const isTabSelected = (pathSubstring: string) =>
    location.pathname.split("/").filter(Boolean).pop() === pathSubstring;
  const registerTabsSelected = registerTabs
    .map((tab) => isTabSelected(tab.route))
    .some((selected) => selected);

  return (
    <article className="max-w-5xl px-4 pt-12 pb-8 mx-auto">
      {registerTabsSelected && (
        <div className="jumpu-boxed-tabs flex justify-between mb-6">
          <h1 className="text-4xl font-bold border-b">登録</h1>
          {/**
           * NOTE: .jumpu-boxed-tabs がナビゲーションタブの実装に対応しておらずARIA APGタブパターンに逸脱した実装になっている
           * see https://github.com/tuqulore/jumpu-ui/issues/544
           */}
          <nav role="tablist" className="!justify-end">
            {registerTabs.map((tab) => (
              <Link
                role="tab"
                aria-selected={isTabSelected(tab.route)}
                className="min-w-[10rem]"
                to={tab.route}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
      <Outlet />
      {children}
    </article>
  );
}

export default withAuthenticationRequired(Layout);
