import { RouteObject, Outlet, useRoutes } from "react-router-dom";
import { routes } from "./utils/routes";
import Profiles from "./pages/Profiles";
import Holder from "./pages/Holder";
import Certifier from "./pages/Certifier";
import Tech from "./pages/Tech";
import Website from "./pages/Website";

const profiles: RouteObject = {
  path: routes.profiles.path,
  element: <Profiles />,
};
const holder: RouteObject = {
  path: routes.holder.path,
  element: <Outlet />,
  children: [
    { path: "", /*                   */ element: <Holder back="../.." /> },
    { path: routes.certifier.path, /**/ element: <Certifier back=".." /> },
    { path: routes.tech.path, /*     */ element: <Tech back=".." /> },
  ],
};
const website: RouteObject = {
  path: routes.website.path,
  element: <Outlet />,
  children: [
    { path: "", /*              */ element: <Website /> },
    { path: routes.tech.path, /**/ element: <Tech back=".." /> },
    holder,
  ],
};

function App() {
  const element = useRoutes([profiles, holder, website]);
  return element;
}

export default App;
