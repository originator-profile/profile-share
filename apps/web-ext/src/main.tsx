import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import { HashRouter } from "react-router-dom";
import App from "./App";

const init = () => {
  const root = document.getElementById("root");
  if (!root) return;
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>,
  );
};

init();
