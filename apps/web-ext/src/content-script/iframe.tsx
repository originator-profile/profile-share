import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "jotai";
import App from "./App";

const init = () => {
  const root = document.createElement("div");
  if (!root) return;
  document.body.appendChild(root);
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Provider>
        <App />
      </Provider>
    </React.StrictMode>
  );
};

init();
