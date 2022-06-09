import { Routes, Route } from "react-router-dom";
import { routes } from "./utils/routes";
import Profiles from "./pages/Profiles";
import Holder from "./pages/Holder";
import Certifier from "./pages/Certifier";
import TechnicalInformation from "./pages/TechnicalInformation";
import Website from "./pages/Website";
import NestedHolder from "./pages/NestedHolder";
import NestedCertifier from "./pages/NestedCertifier";
import NestedTechnicalInformation from "./pages/NestedTechnicalInformation";

function App() {
  return (
    <Routes>
      <Route path={routes.profiles.path} element={<Profiles />} />
      <Route path={routes.holder.path} element={<Holder />} />
      <Route path={routes.certifier.path} element={<Certifier />} />
      <Route
        path={routes.technicalInformation.path}
        element={<TechnicalInformation />}
      />
      <Route path={routes.website.path} element={<Website />} />
      <Route path={routes.nestedHolder.path} element={<NestedHolder />} />
      <Route path={routes.nestedCertifier.path} element={<NestedCertifier />} />
      <Route
        path={routes.nestedTechnicalInformation.path}
        element={<NestedTechnicalInformation />}
      />
    </Routes>
  );
}

export default App;
