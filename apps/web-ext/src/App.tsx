import { RouteObject, Outlet, useRoutes } from "react-router-dom";
import { routes } from "./utils/routes";
import Root from "./pages/Root";
import Op from "./pages/Op";
import Dp from "./pages/Dp";

const root: RouteObject = {
  path: routes.root.path,
  element: <Root />,
};
const op: RouteObject = {
  path: routes.op.path,
  element: <Outlet />,
  children: [{ path: "", element: <Op back="../.." /> }],
};
const dp: RouteObject = {
  path: routes.dp.path,
  element: <Outlet />,
  children: [{ path: "", element: <Dp /> }, op],
};

function App() {
  const element = useRoutes([root, op, dp]);
  return element;
}

export default App;
