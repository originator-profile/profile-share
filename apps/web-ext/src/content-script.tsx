import React from "react";
import ReactDOM from "react-dom/client";
import "./content-script/style.css";
import { Provider } from "jotai";
import App from "./content-script/App";

const init = () => {
  const root = document.createElement("div");
  document.body.appendChild(root);
  root.id = "profile-web-extension-root";
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Provider>
        <App />
      </Provider>
    </React.StrictMode>
  );
};

init();
