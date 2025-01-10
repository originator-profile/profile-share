import { RouteObject, Outlet, useRoutes } from "react-router";
import { routes } from "./utils/routes";
import Base from "./pages/Base";
import Org from "./pages/Org";
import Prohibition from "./pages/Prohibition";
import SiteProfile from "./pages/SiteProfile";
import Credentials from "./pages/Credentials";

const org: RouteObject = {
  path: routes.org.path,
  element: <Outlet />,
  children: [{ path: "", element: <Org back=".." /> }],
};
const publ: RouteObject = {
  path: routes.publ.path,
  element: <Outlet />,
  children: [
    {
      path: "",
      element: (
        <>
          <SiteProfile />
          <Credentials />
        </>
      ),
    },
    org,
  ],
};
const site: RouteObject = {
  path: routes.site.path,
  element: <Outlet />,
  children: [
    {
      path: "",
      element: (
        <>
          <SiteProfile />
        </>
      ),
    },
    org,
  ],
};
const prohibition: RouteObject = {
  path: routes.prohibition.path,
  element: <Prohibition />,
};
const base: RouteObject = {
  path: routes.base.path,
  element: <Outlet />,
  children: [{ path: "", element: <Base /> }, publ, site, prohibition],
};

function App() {
  const element = useRoutes([base]);
  return element;
}

export default App;
