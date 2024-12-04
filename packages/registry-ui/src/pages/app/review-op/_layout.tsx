import { Outlet } from "react-router";
import { withAuthenticationRequired } from "@auth0/auth0-react";

function Article() {
  return (
    <article className="max-w-5xl px-4 pt-12 pb-8 mx-auto">
      <Outlet />
    </article>
  );
}

function Layout() {
  return (
    <>
      <Article />
    </>
  );
}

export default withAuthenticationRequired(Layout);
