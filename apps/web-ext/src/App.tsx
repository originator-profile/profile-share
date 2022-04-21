import { Routes, Route } from "react-router-dom";
import { InlineIcon } from "@iconify/react";
import { Disclosure } from "@headlessui/react";
import Holders from "./pages/Holders";
import Holder from "./pages/Holder";
import Credential from "./pages/Credential";
import TechnicalInformation from "./pages/TechnicalInformation";

function App(): React.ReactElement {
  return (
    <div className="p-4">
      <p css={{ letterSpacing: 2 }} className="mb-2">
        Hello World <InlineIcon icon="heroicons-solid:heart" />
      </p>
      <button className="mb-2 jumpu-button">ボタン</button>
      <Disclosure>
        <div className="jumpu-accordion">
          <Disclosure.Button>アコーディオン</Disclosure.Button>
          <Disclosure.Panel className="p-2">
            アコーディオンパネル
          </Disclosure.Panel>
        </div>
      </Disclosure>
      <Routes>
        <Route path="/index.html" element={<Holders />} />
        <Route path="/holder" element={<Holder />} />
        <Route path="/credential" element={<Credential />} />
        <Route
          path="/technical-information"
          element={<TechnicalInformation />}
        />
      </Routes>
    </div>
  );
}

export default App;
