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
    <>
      <nav className="flex-shrink-0 w-20 h-screen overflow-y-auto fixed bg-white shadow-xl z-10">
        <Publs />
      </nav>
      <main className="pl-20">{element}</main>
    </>
  );
}

export default App;
