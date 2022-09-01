import { RouteObject, Outlet, useRoutes } from "react-router-dom";
import { routes } from "./utils/routes";
import Root from "./pages/Root";
import Org from "./pages/Org";
import Publ from "./pages/Publ";
import Publs from "./pages/Publs";

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
  return (
    <div className="flex">
      <nav className="flex-shrink-0 w-20 h-screen overflow-y-auto bg-white sticky top-0 shadow-xl z-10">
        <Publs />
      </nav>
      <main className="flex-1">{element}</main>
    </div>
  );
}

export default App;
