import browser from "webextension-polyfill";
import storage from "./utils/storage";
import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import { HashRouter } from "react-router-dom";
import { Provider } from "jotai";
import App from "./App";

window.addEventListener("unload", () => {
  const tabId = storage.getItem("tabId");
  if (!tabId) return;
  browser.tabs.sendMessage(tabId, { type: "close-window" });
});

const init = () => {
  const root = document.getElementById("root");
  if (!root) return;
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Provider>
        <HashRouter>
          <App />
        </HashRouter>
      </Provider>
    </React.StrictMode>
  );
};

init();
