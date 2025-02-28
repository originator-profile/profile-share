import { Outlet, RouteObject, useRoutes } from "react-router";
import { overlayExtensionMessenger } from "./components/overlay/extension-events";
import Base from "./pages/Base";
import Credentials from "./pages/Credentials";
import Org from "./pages/Org";
import Prohibition from "./pages/Prohibition";
import SiteProfile from "./pages/SiteProfile";
import { buildPublUrl, routes } from "./utils/routes";

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

overlayExtensionMessenger.onMessage("select", ({ sender, data }) => {
  document.location.hash = buildPublUrl(
    sender.tab.id,
    data.activeCa.attestation.doc,
  );
});

function App() {
  const element = useRoutes([base]);
  return element;
}

export default App;
