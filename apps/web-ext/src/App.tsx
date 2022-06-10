import { Routes, Route, Outlet } from "react-router-dom";
import { routes } from "./utils/routes";
import Profiles from "./pages/Profiles";
import Holder from "./pages/Holder";
import Certifier from "./pages/Certifier";
import TechnicalInformation from "./pages/TechnicalInformation";
import Website from "./pages/Website";

function App() {
  return (
    <Routes>
      <Route path={routes.profiles.path} element={<Profiles />} />
      <Route path={routes.holder.path} element={<Outlet />}>
        <Route path="" element={<Holder back="../.." />} />
        <Route path={routes.certifier.path} element={<Certifier back=".." />} />
        <Route
          path={routes.tech.path}
          element={<TechnicalInformation back=".." />}
        />
      </Route>
      <Route path={routes.website.path} element={<Outlet />}>
        <Route path="" element={<Website />} />
        <Route
          path={routes.tech.path}
          element={<TechnicalInformation back=".." />}
        />
        <Route path={routes.holder.path} element={<Outlet />}>
          <Route path="" element={<Holder back="../.." />} />
          <Route
            path={routes.certifier.path}
            element={<Certifier back=".." />}
          />
          <Route
            path={routes.tech.path}
            element={<TechnicalInformation back=".." />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
