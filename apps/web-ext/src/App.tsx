import { RouteObject, Outlet, useRoutes } from "react-router-dom";
import { routes } from "./utils/routes";
import Base from "./pages/Base";
import Org from "./pages/Org";
import Publ from "./pages/Publ";
import Prohibition from "./pages/Prohibition";

const org: RouteObject = {
  path: routes.org.path,
  element: <Outlet />,
  children: [{ path: "", element: <Org back=".." /> }],
};
const publ: RouteObject = {
  path: routes.publ.path,
  element: <Outlet />,
  children: [{ path: "", element: <Publ /> }, org],
};
const site: RouteObject = {
  path: routes.site.path,
  element: <Outlet />,
  children: [{ path: "", element: <Publ /> }, org],
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
