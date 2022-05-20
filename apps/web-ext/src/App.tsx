import { Routes, Route } from "react-router-dom";
import Holders from "./pages/Holders";
import Holder from "./pages/Holder";
import Certifier from "./pages/Certifier";
import TechnicalInformation from "./pages/TechnicalInformation";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Holders />} />
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
