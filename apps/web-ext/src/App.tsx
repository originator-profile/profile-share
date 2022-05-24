import { Routes, Route } from "react-router-dom";
import Profiles from "./pages/Profiles";
import Holder from "./pages/Holder";
import Certifier from "./pages/Certifier";
import TechnicalInformation from "./pages/TechnicalInformation";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Profiles />} />
      <Route path="/:subject/holder" element={<Holder />} />
      <Route path="/:subject/certifier" element={<Certifier />} />
      <Route
        path="/:subject/technical-information"
        element={<TechnicalInformation />}
      />
    </Routes>
  );
}

export default App;
