import { Outlet, useLocation, Link } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  const location = useLocation();

  // URLのパスを見て、どのタブが選択されているかを判定する
  const isTabSelected = (pathSubstring: string) =>
    location.pathname.endsWith(pathSubstring) ||
    location.pathname.endsWith(`${pathSubstring}/`);

  return (
    <article className="max-w-5xl px-4 pt-12 pb-8 mx-auto">
      <div className="flex flex-col mb-6">
        <div className="jumpu-boxed-tabs">
          <h1 className="text-4xl font-bold">登録</h1>
          <div className="ml-auto">
            <div role="tablist" aria-label="Sample BoxedTabs">
              <button
                role="tab"
                aria-selected={isTabSelected("holder")}
                aria-controls="panel-1"
                id="tab-1"
                tabIndex={0}
              >
                <Link to="./holder">組織情報</Link>
              </button>
              <button
                role="tab"
                aria-selected={isTabSelected("public-key")}
                aria-controls="panel-2"
                id="tab-2"
                tabIndex={-2}
              >
                <Link to="./public-key">公開鍵</Link>
              </button>
              <button
                role="tab"
                aria-selected={isTabSelected("logo")}
                aria-controls="panel-3"
                id="tab-3"
                tabIndex={-3}
              >
                <Link to="./logo">ロゴマーク</Link>
              </button>
              <button
                role="tab"
                aria-selected={isTabSelected("credential")}
                aria-controls="panel-4"
                id="tab-4"
                tabIndex={-4}
              >
                <Link to="./credential">資格情報</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
      {children}
    </article>
  );
}

export default withAuthenticationRequired(Layout);
