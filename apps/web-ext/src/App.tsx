import { RouteObject, Outlet, useRoutes } from "react-router-dom";
import { routes } from "./utils/routes";
import Base from "./pages/Base";
import Org from "./pages/Org";
import Publ from "./pages/Publ";
import Publs from "./pages/Publs";
import Prohibition from "./pages/Prohibition";

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
const layout: RouteObject = {
  element: (
    <div className="flex">
      <nav className="flex-shrink-0 w-20 h-screen overflow-y-auto bg-white sticky top-0 shadow-xl z-10">
        <Publs />
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  ),
  children: [publ],
};
const prohibition: RouteObject = {
  path: routes.prohibition.path,
  element: <Prohibition />,
};
const base: RouteObject = {
  path: routes.base.path,
  element: <Outlet />,
  children: [{ path: "", element: <Base /> }, layout, prohibition],
};

function App() {
  const element = useRoutes([base]);
  return element;
}

export default App;
