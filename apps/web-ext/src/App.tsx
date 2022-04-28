import { Routes, Route } from "react-router-dom";
import Holders from "./pages/Holders";
import Holder from "./pages/Holder";
import Credential from "./pages/Credential";
import TechnicalInformation from "./pages/TechnicalInformation";

function App(): React.ReactElement {
  return (
    <Routes>
      <Route path="/" element={<Holders />} />
      <Route path="/holder/:subject" element={<Holder />} />
      <Route path="/credential" element={<Credential />} />
      <Route path="/technical-information" element={<TechnicalInformation />} />
    </Routes>
  );
}

export default App;
