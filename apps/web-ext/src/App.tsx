import { RouteObject, Outlet, useRoutes } from "react-router-dom";
import { routes } from "./utils/routes";
import Root from "./pages/Root";
import Org from "./pages/Org";
import Publ from "./pages/Publ";

const root: RouteObject = {
  path: routes.root.path,
  element: <Root />,
};
const org: RouteObject = {
  path: routes.org.path,
  element: <Outlet />,
  children: [{ path: "", element: <Org back="../.." /> }],
};
const publ: RouteObject = {
  path: routes.publ.path,
  element: <Outlet />,
  children: [{ path: "", element: <Publ /> }, org],
};

function App() {
  const element = useRoutes([root, publ]);
  return element;
}

export default App;
