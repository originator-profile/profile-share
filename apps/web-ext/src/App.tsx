import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import { overlayExtensionMessenger } from "./components/overlay/extension-events";
import Base from "./pages/Base";
import Credentials from "./pages/Credentials";
import Org from "./pages/Org";
import Prohibition from "./pages/Prohibition";
import SiteProfile from "./pages/SiteProfile";
import { buildPublUrl, routes } from "./utils/routes";

function App() {
  useEffect(() => {
    const cleanup = overlayExtensionMessenger.onMessage("select", ({ sender, data }) => {
      document.location.hash = buildPublUrl(
        sender.tab.id,
        data.activeCa.attestation.doc,
      );
    });

    return () => {
      cleanup();
    };
  }, []);

  return (
    <Routes>
      <Route path="/">
        <Route index element={<Navigate to="/tab" replace />} />
        <Route path="tab/:tabId">
          <Route index element={<Base />} />
          <Route path="site">
            <Route index element={<SiteProfile />} />
            <Route path="org/:contentType/:orgIssuer/:orgSubject" element={<Org back="../.." />} />
          </Route>
          <Route path="publ/:issuer/:subject">
            <Route index element={
              <div className="flex flex-col">
                <SiteProfile />
                <Credentials />
              </div>
            } />
            <Route path="org/:contentType/:orgIssuer/:orgSubject" element={<Org back="../.." />} />
          </Route>
          <Route path="prohibition" element={<Prohibition />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
