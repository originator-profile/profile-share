import { RouteObject, Outlet, useRoutes } from "react-router-dom";
import { routes } from "./utils/routes";
import Base from "./pages/Base";
import Org from "./pages/Org";
import Publ from "./pages/Publ";
import Publs from "./pages/Publs";

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
const base: RouteObject = {
  path: routes.base.path,
  element: <Outlet />,
  children: [{ path: "", element: <Base /> }, publ],
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
  children: [base],
};

function App() {
  const element = useRoutes([layout]);
  return element;
}

export default App;
