import { Routes, Route } from "react-router-dom";
import Holders from "./pages/Holders";
import Holder from "./pages/Holder";
import Credential from "./pages/Credential";
import TechnicalInformation from "./pages/TechnicalInformation";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Holders />} />
      <Route path="/:subject/holder" element={<Holder />} />
      <Route path="/:subject/credential" element={<Credential />} />
      <Route
        path="/:subject/technical-information"
        element={<TechnicalInformation />}
      />
    </Routes>
  );
}

export default App;
